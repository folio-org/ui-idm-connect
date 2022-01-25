import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import ContractView from './ContractView';
import contractFixtures from '../../../test/jest/fixtures/contract';
import contractWithoutDateAndStatusPending from '../../../test/jest/fixtures/contractWithoutDateAndStatusPending';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

const handleExpandAll = jest.fn();

const renderContract = (stripes, contract, editPerm, deletePerm) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <ContractView
          handlers={handlers}
          isLoading={false}
          record={contract}
          stripes={stripes}
          canEdit={editPerm}
          canDelete={deletePerm}
          handleExpandAll={handleExpandAll}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('ContractView', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderContract(stripes, contractFixtures, true, true);
  });

  it('should render contract', async () => {
    await userEvent.click(screen.getByText('Personal information'));

    expect(screen.getByText('Last name')).toBeVisible();
  });

  it('should display the full name twice', () => {
    expect(screen.getAllByText('Führer, Lienhardt').length).toEqual(2);
  });

  it('should render contract header', () => {
    expect(document.querySelector('#contractHeader')).toBeInTheDocument();
  });

  it('should render accordions', () => {
    expect(document.querySelector('#personalAccordion')).toBeInTheDocument();
    expect(document.querySelector('#contractAccordion')).toBeInTheDocument();
    expect(document.querySelector('#contactAccordion')).toBeInTheDocument();
    expect(document.querySelector('#commentAccordion')).toBeInTheDocument();
  });

  test('close and open accordions', () => {
    const expandCollapseAllButton = document.querySelector('#clickable-expand-all');
    const accordionPersonal = document.querySelector('#accordion-toggle-button-personalAccordion');
    const accordionContract = document.querySelector('#accordion-toggle-button-contractAccordion');
    const accordionContact = document.querySelector('#accordion-toggle-button-contactAccordion');
    const accordionComment = document.querySelector('#accordion-toggle-button-commentAccordion');
    expect(accordionPersonal).toBeInTheDocument();
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'false');

    userEvent.click(accordionPersonal);
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'true');

    userEvent.click(expandCollapseAllButton);
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'true');
    expect(accordionContract).toHaveAttribute('aria-expanded', 'true');
    expect(accordionContact).toHaveAttribute('aria-expanded', 'true');
    expect(accordionComment).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Collapse all' })).toBeInTheDocument();

    userEvent.click(expandCollapseAllButton);
    expect(accordionPersonal).toHaveAttribute('aria-expanded', 'false');
    expect(accordionContract).toHaveAttribute('aria-expanded', 'false');
    expect(accordionContact).toHaveAttribute('aria-expanded', 'false');
    expect(accordionComment).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Expand all' })).toBeInTheDocument();
  });

  it('should render the actions menu with edit and delete option', () => {
    const actionButton = document.querySelector('[data-test-pane-header-actions-button]');
    expect(actionButton).toBeVisible();
    userEvent.click(actionButton);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeInTheDocument();
    userEvent.click(editButton);
    expect(handlers.onEdit).toHaveBeenCalled();

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeInTheDocument();
    userEvent.click(deleteButton);
    expect(screen.getByText('Do you really want to delete Führer, Lienhardt?')).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    const submitButton = screen.getByRole('button', { name: 'Delete' });
    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);
    expect(handlers.onDelete).toHaveBeenCalled();
  });

  test('click cancel delete option', () => {
    const actionButton = document.querySelector('[data-test-pane-header-actions-button]');
    expect(actionButton).toBeVisible();
    userEvent.click(actionButton);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    expect(deleteButton).toBeInTheDocument();
    userEvent.click(deleteButton);
    expect(screen.getByText('Do you really want to delete Führer, Lienhardt?')).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);
  });
});

describe('ContractView - without delete permission', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderContract(stripes, contractFixtures, true, false);
  });

  it('should render the actions menu with edit option but NOT delete option', () => {
    const actionButton = document.querySelector('[data-test-pane-header-actions-button]');
    expect(actionButton).toBeVisible();
    userEvent.click(actionButton);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeInTheDocument();
    userEvent.click(editButton);
    expect(handlers.onEdit).toHaveBeenCalled();

    const deleteButton = document.querySelector('#clickable-delete-contract');
    expect(deleteButton).not.toBeInTheDocument();
  });
});

describe('ContractView - with delete permission but status NOT draft', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderContract(stripes, contractWithoutDateAndStatusPending, true, true);
  });

  it('should render the actions menu with edit option but NOT delete option', () => {
    const actionButton = document.querySelector('[data-test-pane-header-actions-button]');
    expect(actionButton).toBeVisible();
    userEvent.click(actionButton);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    expect(editButton).toBeInTheDocument();

    const deleteButton = document.querySelector('#clickable-delete-contract');
    expect(deleteButton).not.toBeInTheDocument();
  });
});

describe('ContractView - with empty date and status - without edit and delete permission', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderContract(stripes, contractWithoutDateAndStatusPending, false, false);
  });

  it('should render hyphen for 3 empty dates', () => {
    expect(screen.getAllByText('-').length).toEqual(3);
  });

  it('should not render the actions menu', () => {
    const actionButton = document.querySelector('[data-test-pane-header-actions-button]');
    expect(actionButton).not.toBeInTheDocument();
    expect(document.querySelector('#clickable-edit-contract')).not.toBeInTheDocument();
  });
});
