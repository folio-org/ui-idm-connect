import React from 'react';
import { screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import usersFixtures from '../../../../test/jest/fixtures/users';
import SearchIdm from './SearchIdm';

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);

const store = createStore(reducer);

const renderUsers = (USERS) => renderWithIntl(
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
  </Provider>
);

describe('Search IDM - without results', () => {
  beforeEach(() => {
    renderUsers({});
  });

  it('should show results', () => {
    expect(screen.getByText('No results in IDM')).toBeVisible();
  });
});

describe('Search IDM - with results', () => {
  beforeEach(() => {
    renderUsers(usersFixtures);
  });

  it('should not show results', () => {
    expect(screen.getByText('2 Results in IDM')).toBeVisible();
  });
});
