import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import '../../../../test/jest/__mock__';
import renderWithIntl from '../../../../test/jest/helpers/renderWithIntl';
import usersFixtures from '../../../../test/jest/fixtures/users';
import usersWithFolioUserFixtures from '../../../../test/jest/fixtures/usersWithFolioUser';
import userFixtures from '../../../../test/jest/fixtures/user';
import SearchIdm from './SearchIdm';

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
      <SearchIdm
        isCreateNewUser={newUser}
        isUsersResultsEmpty={resultsEmpty}
        onSubmit={onSubmit}
        handlers={{ onClose }}
        users={USERS}
        renderListOfResults
      />
    </MemoryRouter>
  </Provider>,
  rerender
);

describe('Search IDM - without results', () => {
  beforeEach(() => {
    renderUsers([], false, true);
  });

  it('should show pane title', () => {
    expect(screen.getByText('Search IDM')).toBeInTheDocument();
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

  it('should not show take and continue button', () => {
    expect(document.querySelector('#clickable-takeContinue-form')).not.toBeInTheDocument();
  });
});

describe('Search IDM - with results', () => {
  beforeEach(() => {
    renderUsers(usersFixtures, false, false);
  });

  it('should show results', () => {
    expect(screen.getByText('2 Results in IDM')).toBeVisible();
  });

  it('should show all columns of MCL', () => {
    expect(screen.getByText('Uni login')).toBeVisible();
    expect(screen.getByText('Account status')).toBeVisible();
    expect(document.querySelector('#list-column-surname')).toBeInTheDocument();
    expect(document.querySelector('#list-column-givenname')).toBeInTheDocument();
    expect(document.querySelector('#list-column-dateofbirth')).toBeInTheDocument();
    expect(screen.getByText('UL affiliation')).toBeVisible();
    expect(screen.getByText('UB role')).toBeVisible();
    expect(screen.getByText('FOLIO user')).toBeVisible();
    expect(screen.getByText('Active card')).toBeVisible();
    expect(screen.getByText('Uni card number')).toBeVisible();
    expect(screen.getByText('Library card number')).toBeVisible();
  });

  it('should be no folio user available', () => {
    expect(screen.queryAllByText('Not existing').length).toEqual(2);
  });
});

describe('Search IDM - with results having folio users', () => {
  const urlDetail = '/users/preview/8d5851af-b831-4af7-8b6e-854749ff6b9a';
  const urlSearch = '/users?query=edb76lyz';

  beforeEach(() => {
    renderUsers(usersWithFolioUserFixtures, false, false);
  });

  it('should show on user having ONE folio user', () => {
    expect(screen.queryAllByText('Hausman, Linhart').length).toEqual(1);
    expect(screen.getByText('Hausman, Linhart')).toHaveAttribute('href', urlDetail);
  });

  it('should show on user having MULTIPLE folio users', () => {
    expect(screen.queryAllByText('Multiple records found').length).toEqual(1);
    expect(screen.getByText('Multiple records found')).toHaveAttribute('href', urlSearch);
  });
});

describe('Search IDM - trigger search', () => {
  beforeEach(() => {
    renderWithIntlResult = renderUsers(usersFixtures, true, false);
  });

  test('enter lastname, firstname and date of birth and click search button', async () => {
    const lastnameInput = document.querySelector('#searchIdm_lastname');
    const firstnameInput = document.querySelector('#searchIdm_firstname');
    const dateOfBirthInput = document.querySelector('#searchIdm_dateOfBirth');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(searchButton).toHaveAttribute('disabled');

    userEvent.type(lastnameInput, 'Hausmann');
    userEvent.type(firstnameInput, 'Lienhardt');
    userEvent.type(dateOfBirthInput, '06/12/1874');
    userEvent.click(searchButton);

    renderUsers(userFixtures, true, false, renderWithIntlResult.rerender);

    expect(onSubmit).toHaveBeenCalled();
    expect(searchButton).not.toHaveAttribute('disabled');
    expect(screen.getByText('1 Result in IDM')).toBeVisible();

    expect(cancelButton).toBeInTheDocument();

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    expect(continueButton).toBeInTheDocument();
    const chooseButton = screen.getByRole('button', { name: 'Choose' });
    expect(chooseButton).toBeInTheDocument();
    userEvent.click(chooseButton);
    const selectedButton = screen.getByRole('button', { name: 'Selected' });
    expect(selectedButton).toBeInTheDocument();
    const takeAndContinueButton = screen.getByRole('button', { name: 'Take and continue' });
    expect(takeAndContinueButton).toBeInTheDocument();

    userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Search IDM - select user, enter new search and create empty contract', () => {
  beforeEach(() => {
    renderWithIntlResult = renderUsers(usersFixtures, true, false);
  });

  test('enter lastname, firstname and date of birth and click search button', async () => {
    const lastnameInput = document.querySelector('#searchIdm_lastname');
    const firstnameInput = document.querySelector('#searchIdm_firstname');
    const dateOfBirthInput = document.querySelector('#searchIdm_dateOfBirth');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchButton).toHaveAttribute('disabled');

    userEvent.type(lastnameInput, 'Hausmann');
    userEvent.type(firstnameInput, 'Lienhardt');
    userEvent.type(dateOfBirthInput, '1874-06-12');
    userEvent.click(searchButton);

    renderUsers(userFixtures, true, false, renderWithIntlResult.rerender);

    expect(onSubmit).toHaveBeenCalled();
    // expect(searchButton).toHaveProperty('disabled', true);
    expect(searchButton).not.toHaveAttribute('disabled');
    expect(screen.getByText('1 Result in IDM')).toBeVisible();

    userEvent.type(lastnameInput, 'lastname');
    userEvent.type(firstnameInput, 'firstname');
    userEvent.type(dateOfBirthInput, '1874-06-12');
    userEvent.click(searchButton);

    renderUsers([], true, true, renderWithIntlResult.rerender);

    expect(screen.getByText('No results in IDM')).toBeVisible();

    const continueButton = screen.getByRole('button', { name: 'Continue' });
    expect(continueButton).toBeInTheDocument();
  });
});

describe('Search IDM - Create new user', () => {
  beforeEach(() => {
    renderWithIntlResult = renderUsers(usersFixtures, true, false);
  });

  it('should show take and continue button', () => {
    const lastnameInput = document.querySelector('#searchIdm_lastname');
    const firstnameInput = document.querySelector('#searchIdm_firstname');
    const dateOfBirthInput = document.querySelector('#searchIdm_dateOfBirth');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    const continueButton = screen.getByRole('button', { name: 'Continue' });
    expect(continueButton).toBeVisible();
    expect(continueButton).toHaveAttribute('disabled');

    userEvent.type(lastnameInput, 'Hausmann');
    userEvent.type(firstnameInput, 'Lienhardt');
    userEvent.type(dateOfBirthInput, '1874-06-12');
    userEvent.click(searchButton);

    renderUsers(userFixtures, true, false, renderWithIntlResult.rerender);

    expect(onSubmit).toHaveBeenCalled();
    // expect(searchButton).toHaveProperty('disabled', true);
    expect(searchButton).not.toHaveAttribute('disabled');
    expect(screen.getByText('1 Result in IDM')).toBeVisible();

    const chooseButton = screen.getByRole('button', { name: 'Choose' });
    expect(chooseButton).toBeVisible();
    expect(chooseButton).not.toHaveAttribute('disabled');
    const noMatchButton = screen.getByRole('button', { name: 'No match' });
    expect(noMatchButton).toBeVisible();
    expect(chooseButton).not.toHaveAttribute('disabled');

    userEvent.click(noMatchButton);
    expect(continueButton).not.toHaveAttribute('disabled');
  });
});
