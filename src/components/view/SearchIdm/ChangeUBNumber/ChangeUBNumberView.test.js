import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';

import '../../../../../test/jest/__mock__';
import renderWithIntl from '../../../../../test/jest/helpers/renderWithIntl';
import userFixtures from '../../../../../test/jest/fixtures/user';
import ChangeUBNumberView from './ChangeUBNumberView';

// let renderWithIntlResult = {};

const onClose = jest.fn();
const onSubmit = jest.fn();

const renderUsers = (USER) => renderWithIntl(
  <MemoryRouter>
    <ChangeUBNumberView
      onSubmit={onSubmit}
      handlers={{ onClose }}
      users={USER}
      invalid={false}
      pristine={false}
      submitting={false}
      values={{}}
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
});
