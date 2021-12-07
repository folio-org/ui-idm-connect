import React from 'react';
import { screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';

import '../../../test/jest/__mock__';
import stripes from '../../../test/jest/__mock__/stripesCore.mock';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import ContractsForm from './ContractsForm';
// import userFixtures from '../../../test/jest/fixtures/user';

const onClose = jest.fn();
const onSubmit = jest.fn();

const renderContractsForm = (initVal) => renderWithIntl(
  <StripesContext.Provider value={stripes}>
    <MemoryRouter>
      <Form
        onSubmit={jest.fn}
        render={() => (
          <ContractsForm
            handlers={{ onClose }}
            onSubmit={onSubmit}
            initialValues={initVal}
            isLoading={false}
            pristine
            submitting
          />
        )}
      />
    </MemoryRouter>
  </StripesContext.Provider>
);

describe('Create new contract - without initial values', () => {
  beforeEach(() => {
    renderContractsForm({});
  });

  it('should show pane title', () => {
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('should show all accordions', () => {
    expect(document.querySelector('#editPersonalAccordion')).toBeInTheDocument();
    expect(document.querySelector('#editContractAccordion')).toBeInTheDocument();
    expect(document.querySelector('#editContactAccordion')).toBeInTheDocument();
    expect(document.querySelector('#editCommentAccordion')).toBeInTheDocument();
  });

  test('required fields', async () => {
    expect(screen.getByRole('textbox', { name: 'Lastname' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Firstname' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Academic title' })).not.toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Date of birth' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'End date' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Library card' })).not.toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Uni login' })).not.toBeRequired();
    expect(screen.getByRole('textbox', { name: 'External email' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Street' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Addition to address' })).not.toBeRequired();
    expect(screen.getByRole('textbox', { name: 'ZIP code' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'City' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Country' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Comment' })).not.toBeRequired();
  });
});

