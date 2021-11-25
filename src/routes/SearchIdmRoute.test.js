import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import '../../test/jest/__mock__';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import SearchIdmRoute from './SearchIdmRoute';

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);

const store = createStore(reducer);

const historyPushMock = jest.fn();

const renderUsers = (USERS, rerender) => renderWithIntl(
  <Provider store={store}>
    <MemoryRouter>
      <SearchIdmRoute
        onSubmit={jest.fn()}
        users={USERS}
        readyToRender
        history={{ push: historyPushMock }}
        location={{ search: '' }}
      />
    </MemoryRouter>
  </Provider>,
  rerender
);

describe('SearchIdm', () => {
  describe('rendering the route with permissions', () => {
    beforeEach(() => {
      renderUsers({});
    });

    test('renders the Search IDM component', async () => {
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(screen.getByText('IDM Search')).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      await userEvent.click(cancelButton);
      expect(historyPushMock).toHaveBeenCalled();
    });
  });
});
