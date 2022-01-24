import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';

import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import ContractView from './ContractView';
import contractFixtures from '../../../test/jest/fixtures/contract';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

const handleExpandAll = jest.fn();

const renderContract = (stripes, contract, editPerm, deletePerm, statusDraft) => {
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
          isStatusDraft={statusDraft}
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
    renderContract(stripes, contractFixtures, true, true, true);
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
    const submitButton = screen.getByRole('button', { name: 'Submit' });
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
    renderContract(stripes, contractFixtures, true, false, true);
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

describe('ContractView - with status pending', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderContract(stripes, contractFixtures, true, true, false);
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
  const contractWithoutDate = {
    id: '465ce0b3-10cd-4da2-8848-db85b63a0a32',
    personal: {
      firstName: 'Lienhardt',
      lastName: 'Führer',
      academicTitle: 'Dr.',
      dateOfBirth: '',
      address: {
        addressLine1: 'Peter-Schmitter-Straße 83',
        addressLine2: 'F/8',
        zipCode: '88453',
        city: 'Erolzheim',
        country: 'Germany'
      },
      email: 'lienhardtfuehrer@aol.com'
    },
    libraryCard: '79254581',
    uniLogin: 'mhb76lxa',
    status: '',
    beginDate: '',
    endDate: '',
    comment: 'A comment.',
    metadata: {
      createdDate: '2021-11-01T17:39:12.364+00:00',
      updatedDate: '2021-11-01T17:39:12.364+00:00'
    }
  };

  beforeEach(() => {
    stripes = useStripes();
    renderContract(stripes, contractWithoutDate, false, false, false);
  });

  it('should render hyphen for 3 empty dates and one empty status', () => {
    expect(screen.getAllByText('-').length).toEqual(4);
  });

  it('should not render the actions menu', () => {
    const actionButton = document.querySelector('[data-test-pane-header-actions-button]');
    expect(actionButton).not.toBeInTheDocument();
    expect(document.querySelector('#clickable-edit-contract')).not.toBeInTheDocument();
  });
});
