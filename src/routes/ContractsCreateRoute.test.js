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
// import contractFixtures from '../../test/jest/fixtures/contract';

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);
const store = createStore(reducer);

const renderUsers = (initVal) => renderWithIntl(
  <Provider store={store}>
    <MemoryRouter>
      <ContractsForm
        handlers={{ onClose: jest.fn() }}
        onSubmit={jest.fn()}
        initialValues={initVal}
        // history={{ push: historyPushMock }}
        // location={{ search: '' }}
        // mutator={{ contracts: contractsPushMock }}
        // resources={{ contracts: contractsFixtures }}
        // stripes={{ hasPerm: () => true, okapi: {} }}
      />
    </MemoryRouter>
  </Provider>
);

describe('SearchIdm', () => {
  describe('rendering the route with permissions', () => {
    beforeEach(() => {
      renderUsers({});
    });

    test('renders the Search IDM component', async () => {
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(screen.getByText('Create')).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      // await userEvent.click(cancelButton);
      // expect(historyPushMock).toHaveBeenCalled();
    });
  });
});
