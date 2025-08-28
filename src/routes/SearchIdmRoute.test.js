import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { CalloutContext } from '@folio/stripes/core';

import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import SearchIdmRoute from './SearchIdmRoute';
import urls from '../components/DisplayUtils/urls';
import user from '../../test/jest/fixtures/user';
import users from '../../test/jest/fixtures/usersWithFolioUser';

const { Response } = jest.requireActual('node-fetch');

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);

let store;
let sendCalloutMock;
const historyPushMock = jest.fn();

const renderSearchIdmRoute = (sendCallout) => renderWithIntl(
  <CalloutContext.Provider value={{ sendCallout }}>
    <Provider store={store}>
      <MemoryRouter>
        <SearchIdmRoute
          history={{ push: historyPushMock }}
          location={{ search: '', state: '' }}
        />
      </MemoryRouter>
    </Provider>
  </CalloutContext.Provider>
);

describe('When SearchIdmRoute is rendered', () => {
  beforeEach(() => {
    sendCalloutMock = jest.fn();
    store = createStore(reducer);
    renderSearchIdmRoute(sendCalloutMock);
  });

  it('should display textboxes and buttons', () => {
    expect(screen.getByRole('textbox', { name: 'Last name' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'First name' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Birth date' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('clicking the cancel button should push to history', async () => {
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(historyPushMock).toHaveBeenCalledWith(urls.contracts());
  });

  describe('When form is filled', () => {
    let originalFetch;
    let resp200WithUser;
    let resp200WithFolioUser;
    let resp500;

    beforeEach(async () => {
      originalFetch = global.fetch;
      resp200WithUser = Promise.resolve(new Response(JSON.stringify(user), { status: 200, statusText: 'Ok' }));
      resp200WithFolioUser = Promise.resolve(new Response(JSON.stringify(users[0].folioUsers), { status: 200, statusText: 'Ok' }));
      resp500 = Promise.resolve(new Response(null, { status: 500, statusText: 'Internal Server Error' }));
      await userEvent.type(screen.getByRole('textbox', { name: 'Last name' }), 'e');
      await userEvent.type(screen.getByRole('textbox', { name: 'First name' }), 'e');
      await userEvent.type(screen.getByRole('textbox', { name: 'Birth date' }), '01/01/2000');
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('search button should be enabled', () => {
      expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
    });

    it('clicking search should render result if fetches are OK', async () => {
      global.fetch = jest.fn((url) => (url.includes('/idm-connect/searchidm') ? resp200WithUser : resp200WithFolioUser));

      await userEvent.click(screen.getByRole('button', { name: 'Search' }));
      expect(await screen.findByText('Hausman, Linhart')).toBeInTheDocument();
    });

    it('clicking search should display error if fetch /users is not OK', async () => {
      global.fetch = jest.fn((url) => (url.includes('/idm-connect/searchidm') ? resp200WithUser : resp500));

      await userEvent.click(screen.getByRole('button', { name: 'Search' }));
      expect(sendCalloutMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          message: expect.stringContaining('Folio users'),
        })
      );
    });

    it('clicking search should display error if fetch /searchidm is not OK', async () => {
      global.fetch = jest.fn(() => resp500);

      await userEvent.click(screen.getByRole('button', { name: 'Search' }));
      expect(sendCalloutMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          message: expect.stringContaining('IDM users'),
        })
      );
    });
  });
});
