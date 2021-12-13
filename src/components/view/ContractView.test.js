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
  onEdit: jest.fn,
};

const renderContract = (stripes, contract) => {
  return renderWithIntl(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <ContractView
          handlers={handlers}
          isLoading={false}
          record={contract}
          stripes={stripes}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

describe('ContractView', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderContract(stripes, contractFixtures);
  });

  it('should render contract', async () => {
    await userEvent.click(screen.getByText('Personal data'));

    expect(screen.getByText('Lastname')).toBeVisible();
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

  it('should render expand all button', () => {
    const expandAll = screen.getByRole('button', { name: 'Expand all' });
    expect(expandAll).toBeInTheDocument();
  });
});

describe('ContractView - with empty date', () => {
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
    status: 'created',
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
    renderContract(stripes, contractWithoutDate);
  });

  it('should render - for empty dates', () => {
    expect(screen.getAllByText('-').length).toEqual(3);
  });
});
