import React from 'react';
import { screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import '../../test/jest/__mock__';
import renderWithIntl from '../../test/jest/helpers/renderWithIntl';
import ContractsForm from '../components/view/ContractsForm';
// import ContractsCreateRoute from './ContractsCreateRoute';
// import contractsFixtures from '../../test/jest/fixtures/contracts';
import contractFixtures from '../../test/jest/fixtures/contract';

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);
const store = createStore(reducer);

const renderContractsForm = (initVal) => renderWithIntl(
  <Provider store={store}>
    <MemoryRouter>
      <ContractsForm
        handlers={{ onClose: jest.fn() }}
        onSubmit={jest.fn()}
        initialValues={initVal}
      />
    </MemoryRouter>
  </Provider>
);

describe('Create Route', () => {
  describe('rendering the route without initial data', () => {
    beforeEach(() => {
      renderContractsForm({});
    });

    test('renders the create contract component', async () => {
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(screen.getByText('Create walk-in contract')).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });
  });
});

describe('Create Route', () => {
  describe('rendering the route with initial data', () => {
    beforeEach(() => {
      renderContractsForm(contractFixtures);
    });

    test('renders the Search IDM component', async () => {
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(screen.getByText('Führer, Lienhardt')).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });
  });
});
