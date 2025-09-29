import { MemoryRouter } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import userFixtures from '../../../../../test/jest/fixtures/user';
import renderWithIntl from '../../../../../test/jest/helpers/renderWithIntl';
import ChangeUBNumberView from './ChangeUBNumberView';
import * as initialValuesModule from './getInitialValues';

jest.mock('./getInitialValues');

const onClose = jest.fn();
const onSubmit = jest.fn();

const renderUsers = (USER, rerender) => renderWithIntl(
  <MemoryRouter>
    <ChangeUBNumberView
      handlers={{ onClose }}
      invalid={false}
      onSubmit={onSubmit}
      pristine={false}
      submitting={false}
      values={USER}
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
});

describe('Change ub number view - detail active user', () => {
  beforeEach(() => {
    const user = initialValuesModule.default.mockReturnValue({
      ...userFixtures,
      status: 'Aktives Uni-Login',
    });

    renderUsers({ user });
  });

  it('should change the message if the library card number changed', async () => {
    const inputChangeUbNumber = document.querySelector('#field-change-ub-number');
    const saveAndCloseButton = screen.getByRole('button', { name: 'Save & close' });

    expect(inputChangeUbNumber).toBeEnabled();
    expect(saveAndCloseButton).toHaveAttribute('disabled');
    expect(screen.getByText('Please make a change to the library card number.')).toBeInTheDocument();

    await userEvent.type(inputChangeUbNumber, '0015U0016954');
    expect(document.querySelector('#msg-ubreadernumber-added')).toBeInTheDocument();
    expect(saveAndCloseButton).toBeEnabled();

    await userEvent.click(saveAndCloseButton);
    expect(onSubmit).toHaveBeenCalled();
  });
});

describe('Change ub number view - check allowed accountStates for change UB number', () => {
  const enabledStatuses = [
    'Aktives Uni-Login',
    'Uni-Login ohne Vertrag (inaktiv)',
    'Uni-Login ohne Vertrag (in Karenzzeit)',
  ];

  it.each(enabledStatuses)(
    'should enable the input field for accountState "%s"',
    (status) => {
      const user = initialValuesModule.default.mockReturnValue({
        ...userFixtures,
        status,
      });

      renderUsers(user);

      const inputChangeUbNumber = screen.getByRole('textbox', { name: /Library card number/i });
      expect(inputChangeUbNumber).toBeInTheDocument();
      expect(inputChangeUbNumber).toBeEnabled();
    }
  );
});
