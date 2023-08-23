import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
// import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import renderWithIntl from '../../../../../test/jest/helpers/renderWithIntl';
import userFixtures from '../../../../../test/jest/fixtures/user';
import ChangeUBNumberView from './ChangeUBNumberView';

const onClose = jest.fn();
const onSubmit = jest.fn();

const renderUsers = (USER, rerender) => renderWithIntl(
  <MemoryRouter>
    <ChangeUBNumberView
      onSubmit={onSubmit}
      handlers={{ onClose }}
      invalid={false}
      pristine={false}
      submitting={false}
      values={{ USER }}
    />
  </MemoryRouter>,
  rerender
);

describe('Change ub number view - detail', () => {
  beforeEach(() => {
    renderUsers(userFixtures);
  });

  it('should show detail pane title', () => {
    expect(screen.getByText('Edit library card number')).toBeInTheDocument();
  });

  it('should show input field for changing Library card number', () => {
    const inputChangeUbNumber = document.querySelector('#field-change-ub-number');
    expect(inputChangeUbNumber).toBeInTheDocument();
  });

  it('should be disabled the input field for Library card number', () => {
    const inputChangeUbNumber = document.querySelector('#field-change-ub-number');
    const saveAndCloseButton = screen.getByRole('button', { name: 'Save & close' });
    expect(inputChangeUbNumber).toBeInTheDocument();
    expect(saveAndCloseButton).toBeDisabled();
    expect(document.querySelector('#msg-ubreadernumber-statusNotActive')).toBeInTheDocument();
    expect(inputChangeUbNumber).toBeDisabled();
  });

  // TODO for user with accountState: 'Aktives Uni-Login',
  // it('should change the message when enter a Library card number', () => {
  //   const inputChangeUbNumber = document.querySelector('#field-change-ub-number');
  //   const saveAndCloseButton = screen.getByRole('button', { name: 'Save & close' });
  //   expect(inputChangeUbNumber).toBeInTheDocument();
  //   expect(saveAndCloseButton).toHaveAttribute('disabled');
  //   expect(screen.getByText('Please make a change to the library card number.')).toBeInTheDocument();
  //   userEvent.type(inputChangeUbNumber, '0015U0016954');
  //   expect(document.querySelector('#msg-ubreadernumber-added')).toBeInTheDocument();
  //   expect(saveAndCloseButton).not.toHaveAttribute('disabled');
  //   userEvent.click(saveAndCloseButton);
  //   expect(onSubmit).toHaveBeenCalled();
  // });
});
