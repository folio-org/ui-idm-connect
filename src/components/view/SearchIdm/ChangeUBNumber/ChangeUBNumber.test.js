import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {
  combineReducers,
  createStore,
} from 'redux';
import { reducer as formReducer } from 'redux-form';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import userFixtures from '../../../../../test/jest/fixtures/user';
import usersFixtures from '../../../../../test/jest/fixtures/users';
import renderWithIntl from '../../../../../test/jest/helpers/renderWithIntl';
import ChangeUBNumber from './ChangeUBNumber';

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);

const store = createStore(reducer);

let renderWithIntlResult = {};

const onClose = jest.fn();
const onSubmit = jest.fn(e => e.preventDefault());

const renderUsers = (USERS, newUser, resultsEmpty, rerender) => renderWithIntl(
  <Provider store={store}>
    <MemoryRouter>
      <ChangeUBNumber
        handlers={{ onClose }}
        isCreateNewUser={newUser}
        isUsersResultsEmpty={resultsEmpty}
        onSubmit={onSubmit}
        renderListOfResults
        users={USERS}
      />
    </MemoryRouter>
  </Provider>,
  rerender
);

describe('Change ub number - without results', () => {
  beforeEach(() => {
    renderUsers([], false, true);
  });

  it('should show pane title', () => {
    expect(screen.getByText('Change card number')).toBeInTheDocument();
  });

  it('should show input fields', () => {
    expect(screen.getByRole('textbox', { name: 'Last name' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'First name' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Birth date' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should not show results', () => {
    expect(screen.getByText('No results in IDM')).toBeVisible();
  });
});

describe('Change ub number - with results', () => {
  beforeEach(() => {
    renderUsers(usersFixtures, false, false);
  });

  it('should show results', () => {
    expect(screen.getByText('2 Results in IDM')).toBeVisible();
  });

  it('should show all columns of MCL', () => {
    expect(screen.getByText('Active card')).toBeVisible();
    expect(screen.getByText('Uni login')).toBeVisible();
    expect(document.querySelector('#list-column-surname')).toBeInTheDocument();
    expect(document.querySelector('#list-column-givenname')).toBeInTheDocument();
    expect(document.querySelector('#list-column-dateofbirth')).toBeInTheDocument();
    expect(screen.getByText('Account status')).toBeVisible();
    expect(screen.getByText('UL affiliation')).toBeVisible();
    expect(screen.getByText('Uni card number')).toBeVisible();
    expect(screen.getByText('Library card number')).toBeVisible();
    expect(screen.getByText('UB role')).toBeVisible();
    expect(screen.getByText('FOLIO user')).toBeVisible();
  });

  it('should be no folio user available', () => {
    expect(screen.queryAllByText('Not existing').length).toEqual(2);
  });
});

describe('Change ub number - trigger search', () => {
  beforeEach(() => {
    renderWithIntlResult = renderUsers(usersFixtures, true, false);
  });

  test('enter lastname, firstname and date of birth and click search button', async () => {
    const lastnameInput = document.querySelector('#searchIdm_lastname');
    const firstnameInput = document.querySelector('#searchIdm_firstname');
    const dateOfBirthInput = document.querySelector('#searchIdm_dateOfBirth');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(searchButton).toBeDisabled();

    await userEvent.type(lastnameInput, 'Hausmann');
    await userEvent.type(firstnameInput, 'Lienhardt');
    await userEvent.type(dateOfBirthInput, '06/12/1874');
    await userEvent.click(searchButton);

    renderUsers(userFixtures, true, false, renderWithIntlResult.rerender);

    expect(onSubmit).toHaveBeenCalled();
    expect(searchButton).toBeEnabled();
    expect(screen.getByText('1 Result in IDM')).toBeVisible();

    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Change ub number - select user, enter new search and create empty contract', () => {
  beforeEach(() => {
    renderWithIntlResult = renderUsers(usersFixtures, true, false);
  });

  test('enter lastname, firstname and date of birth and click search button', async () => {
    const lastnameInput = document.querySelector('#searchIdm_lastname');
    const firstnameInput = document.querySelector('#searchIdm_firstname');
    const dateOfBirthInput = document.querySelector('#searchIdm_dateOfBirth');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchButton).toBeDisabled();

    await userEvent.type(lastnameInput, 'Hausmann');
    await userEvent.type(firstnameInput, 'Lienhardt');
    await userEvent.type(dateOfBirthInput, '1874-06-12');
    await userEvent.click(searchButton);

    renderUsers(userFixtures, true, false, renderWithIntlResult.rerender);

    expect(onSubmit).toHaveBeenCalled();
    // expect(searchButton).toHaveProperty('disabled', true);
    expect(searchButton).toBeEnabled();
    expect(screen.getByText('1 Result in IDM')).toBeVisible();
  });
});
