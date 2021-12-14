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
import userFixtures from '../../../../test/jest/fixtures/user';
import SearchIdm from './SearchIdm';

const reducers = {
  form: formReducer,
};

const reducer = combineReducers(reducers);

const store = createStore(reducer);

let renderWithIntlResult = {};

const onClose = jest.fn();
const onSubmit = jest.fn();

const renderUsers = (USERS, newUser, rerender) => renderWithIntl(
  <Provider store={store}>
    <MemoryRouter>
      <SearchIdm
        createNewUser={newUser}
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
    renderUsers({}, false);
  });

  it('should show pane title', () => {
    expect(screen.getByText('IDM Search')).toBeInTheDocument();
  });

  it('should show input fields', () => {
    expect(screen.getByRole('textbox', { name: 'Lastname' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Firstname' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Date of birth' })).toBeInTheDocument();
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
    renderUsers(usersFixtures, false);
  });

  it('should show results', () => {
    expect(screen.getByText('2 Results in IDM')).toBeVisible();
  });

  it('should show all columns of MCL', () => {
    expect(screen.getByText('Uni login')).toBeVisible();
    expect(screen.getByText('Account state')).toBeVisible();
    expect(document.querySelector('#list-column-surname')).toBeInTheDocument();
    expect(document.querySelector('#list-column-givenname')).toBeInTheDocument();
    expect(document.querySelector('#list-column-dateofbirth')).toBeInTheDocument();
    expect(screen.getByText('UL Affiliation')).toBeVisible();
  });
});

describe('Search IDM - trigger search', () => {
  beforeEach(() => {
    renderWithIntlResult = renderUsers(usersFixtures, false);
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
    userEvent.type(dateOfBirthInput, '1874-06-12');
    userEvent.click(searchButton);

    renderUsers(userFixtures, false, renderWithIntlResult.rerender);

    expect(onSubmit).toHaveBeenCalled();
    expect(searchButton).not.toHaveAttribute('disabled');
    expect(screen.getByText('1 Result in IDM')).toBeVisible();

    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Search IDM - Create new user', () => {
  beforeEach(() => {
    renderWithIntlResult = renderUsers(usersFixtures, true);
  });

  it('should show take and continue button', () => {
    const lastnameInput = document.querySelector('#searchIdm_lastname');
    const firstnameInput = document.querySelector('#searchIdm_firstname');
    const dateOfBirthInput = document.querySelector('#searchIdm_dateOfBirth');
    const searchButton = screen.getByRole('button', { name: 'Search' });
    const takeAndContinueButton = screen.getByRole('button', { name: 'Take and continue' });
    expect(takeAndContinueButton).toBeVisible();
    expect(takeAndContinueButton).toHaveAttribute('disabled');

    userEvent.type(lastnameInput, 'Hausmann');
    userEvent.type(firstnameInput, 'Lienhardt');
    userEvent.type(dateOfBirthInput, '1874-06-12');
    userEvent.click(searchButton);

    renderUsers(userFixtures, true, renderWithIntlResult.rerender);

    expect(onSubmit).toHaveBeenCalled();
    expect(searchButton).not.toHaveAttribute('disabled');
    expect(screen.getByText('1 Result in IDM')).toBeVisible();

    const chooseButton = screen.getByRole('button', { name: 'Choose' });
    expect(chooseButton).toBeVisible();
    expect(chooseButton).not.toHaveAttribute('disabled');
    const noMatchButton = screen.getByRole('button', { name: 'No match' });
    expect(noMatchButton).toBeVisible();
    expect(chooseButton).not.toHaveAttribute('disabled');

    userEvent.click(noMatchButton);
    expect(takeAndContinueButton).not.toHaveAttribute('disabled');

    // userEvent.click(takeAndContinueButton);
    // expect(screen.getByText('Create')).toBeVisible();
    // expect(document.querySelector('#form-contract')).toBeInTheDocument();
  });
});
