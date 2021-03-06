import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(screen.getByText('Create walk-in contract')).toBeInTheDocument();
  });

  it('should show all accordions', () => {
    expect(document.querySelector('#editPersonalAccordion')).toBeInTheDocument();
    expect(document.querySelector('#editContractAccordion')).toBeInTheDocument();
    expect(document.querySelector('#editContactAccordion')).toBeInTheDocument();
    expect(document.querySelector('#editCommentAccordion')).toBeInTheDocument();
  });

  test('required fields', async () => {
    expect(screen.getByRole('textbox', { name: 'Last name' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'First name' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Academic title' })).not.toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Birth date' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Expiration date' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Library card number' })).not.toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Uni login' })).not.toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Email (external)' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Street' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Addition to address' })).not.toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Zip/Postal Code' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'City' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Country' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Comment' })).not.toBeRequired();
  });

  test('fill required fields should enable Save & close button', async () => {
    const saveAndCloseButton = screen.getByRole('button', { name: 'Save & close' });
    expect(saveAndCloseButton).toHaveAttribute('disabled');

    userEvent.type(screen.getByRole('textbox', { name: 'Last name' }), 'F??hrer');
    userEvent.type(screen.getByRole('textbox', { name: 'First name' }), 'Lienhardt');
    userEvent.type(screen.getByRole('textbox', { name: 'Birth date' }), '04/22/1994');
    userEvent.type(screen.getByRole('textbox', { name: 'Expiration date' }), '01/12/2020');
    userEvent.type(screen.getByRole('textbox', { name: 'Email (external)' }), 'lienhardtfuehrer@aol.com');
    userEvent.type(screen.getByRole('textbox', { name: 'Street' }), 'Peter-Schmitter-Stra??e 83');
    userEvent.type(screen.getByRole('textbox', { name: 'Zip/Postal Code' }), '88453');
    userEvent.type(screen.getByRole('textbox', { name: 'City' }), 'Erolzheim');
    userEvent.type(screen.getByRole('textbox', { name: 'Country' }), 'Germany');

    expect(saveAndCloseButton).not.toHaveAttribute('disabled');
    userEvent.click(saveAndCloseButton);
    expect(onSubmit).toHaveBeenCalled();
  });

  test('click Cancel button', async () => {
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).not.toHaveAttribute('disabled');
    userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  test('close and open accordions', () => {
    const expandCollapseAllButton = document.querySelector('#clickable-expand-all');
    const accordionPersonal = document.querySelector('#accordion-toggle-button-editPersonalAccordion');
    const accordionContract = document.querySelector('#accordion-toggle-button-editContractAccordion');
    const accordionContact = document.querySelector('#accordion-toggle-button-editContactAccordion');
    const accordionComment = document.querySelector('#accordion-toggle-button-editCommentAccordion');
    expect(accordionPersonal).toBeInTheDocument();
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'true');

    userEvent.click(accordionPersonal);
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'false');

    userEvent.click(expandCollapseAllButton);
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'false');
    expect(accordionContract).toHaveAttribute('aria-expanded', 'false');
    expect(accordionContact).toHaveAttribute('aria-expanded', 'false');
    expect(accordionComment).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Expand all' })).toBeInTheDocument();

    userEvent.click(expandCollapseAllButton);
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'true');
    expect(accordionContract).toHaveAttribute('aria-expanded', 'true');
    expect(accordionContact).toHaveAttribute('aria-expanded', 'true');
    expect(accordionComment).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument();
  });
});

