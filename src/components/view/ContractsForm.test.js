import React from 'react';
import { screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import { StripesContext, useStripes } from '@folio/stripes/core';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import ContractsForm from './ContractsForm';

const onClose = jest.fn();
const onSubmit = jest.fn();

const renderContractsForm = (stripes, initVal) => renderWithIntl(
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
    renderContractsForm(useStripes(), {});
  });

  it('should show pane title', () => {
    expect(screen.getByText('Create walk-in contract 2/2: Add record details')).toBeInTheDocument();
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
    expect(saveAndCloseButton).toBeDisabled();

    await userEvent.type(screen.getByRole('textbox', { name: 'Last name' }), 'Führer');
    await userEvent.type(screen.getByRole('textbox', { name: 'First name' }), 'Lienhardt');
    await userEvent.type(screen.getByRole('textbox', { name: 'Birth date' }), '04/22/1994');
    await userEvent.type(screen.getByRole('textbox', { name: 'Expiration date' }), '01/12/2020');
    await userEvent.type(screen.getByRole('textbox', { name: 'Email (external)' }), 'lienhardtfuehrer@aol.com');
    await userEvent.type(screen.getByRole('textbox', { name: 'Street' }), 'Peter-Schmitter-Straße 83');
    await userEvent.type(screen.getByRole('textbox', { name: 'Zip/Postal Code' }), '88453');
    await userEvent.type(screen.getByRole('textbox', { name: 'City' }), 'Erolzheim');
    await userEvent.type(screen.getByRole('textbox', { name: 'Country' }), 'Germany');

    expect(saveAndCloseButton).toBeEnabled();
    await userEvent.click(saveAndCloseButton);
    expect(onSubmit).toHaveBeenCalled();
  }, 10000);

  test('click Cancel button', async () => {
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toBeEnabled();
    await userEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  test('close and open accordions', async () => {
    const expandCollapseAllButton = document.querySelector('#clickable-expand-all');
    const accordionPersonal = document.querySelector('#accordion-toggle-button-editPersonalAccordion');
    const accordionContract = document.querySelector('#accordion-toggle-button-editContractAccordion');
    const accordionContact = document.querySelector('#accordion-toggle-button-editContactAccordion');
    const accordionComment = document.querySelector('#accordion-toggle-button-editCommentAccordion');
    expect(accordionPersonal).toBeInTheDocument();
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(accordionPersonal);
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(expandCollapseAllButton);
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'false');
    expect(accordionContract).toHaveAttribute('aria-expanded', 'false');
    expect(accordionContact).toHaveAttribute('aria-expanded', 'false');
    expect(accordionComment).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Expand all' })).toBeInTheDocument();

    await userEvent.click(expandCollapseAllButton);
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'true');
    expect(accordionContract).toHaveAttribute('aria-expanded', 'true');
    expect(accordionContact).toHaveAttribute('aria-expanded', 'true');
    expect(accordionComment).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument();
  });
});

