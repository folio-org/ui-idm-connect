import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import '../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../test/jest/helpers/renderWithIntl';
import userFixtures from '../../../../../test/jest/fixtures/user';
import ChangeUBNumberView from './ChangeUBNumberView';

const onClose = jest.fn();
const onSubmit = jest.fn();

const renderUsers = (USER) => renderWithIntl(
  <MemoryRouter>
    <ChangeUBNumberView
      onSubmit={onSubmit}
      handlers={{ onClose }}
      invalid={false}
      pristine={false}
      submitting={false}
      values={{ USER }}
    />
  </MemoryRouter>
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

  it('should change the message when enter a Library card number', () => {
    const inputChangeUbNumber = document.querySelector('#field-change-ub-number');
    const saveAndCloseButton = screen.getByRole('button', { name: 'Save & close' });
    expect(inputChangeUbNumber).toBeInTheDocument();
    expect(saveAndCloseButton).toHaveAttribute('disabled');
    expect(screen.getByText('Please make a change to the Libary card number.')).toBeInTheDocument();
    userEvent.type(inputChangeUbNumber, '0015U0016954');
    expect(document.querySelector('#msg-ubreadernumber-added')).toBeInTheDocument();
    expect(saveAndCloseButton).not.toHaveAttribute('disabled');
    userEvent.click(saveAndCloseButton);
    expect(onSubmit).toHaveBeenCalled();
  });
});
