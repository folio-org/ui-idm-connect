import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import '../../test/jest/__mock__';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import SearchIdm from './SearchIdmRoute';

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);

const store = createStore(reducer);

const renderUsers = (USERS, rerender) => renderWithIntl(
  <Provider store={store}>
    <MemoryRouter>
      <SearchIdm
        onSubmit={jest.fn()}
        handlers={{
          onClose: jest.fn(),
        }}
        users={USERS}
        readyToRender
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

    test('renders the Search IDM component', () => {
      expect(screen.getByText('IDM Search')).toBeInTheDocument();
    });
  });
});
