import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useStripes } from '@folio/stripes/core';
import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { MemoryRouter } from 'react-router-dom';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';

import ContractView from './ContractView';
import contract from '../../../test/jest/fixtures/contract';

const handlers = {
  onClose: jest.fn,
  onEdit: jest.fn,
};

const renderContract = (stripes) => {
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
    renderContract(stripes);
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
});
