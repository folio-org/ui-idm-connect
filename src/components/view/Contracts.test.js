import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
// import { Button, Modal } from '@folio/stripes-testing';

import { StripesContext } from '@folio/stripes-core/src/StripesContext';
import { ModuleHierarchyProvider } from '@folio/stripes-core/src/components/ModuleHierarchy';
import { useStripes } from '@folio/stripes/core';

import '../../../test/jest/__mock__';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import contracts from '../../../test/jest/fixtures/contracts';
import Contracts from './Contracts';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const onSearchComplete = jest.fn();
const history = {};

let renderWithIntlResult = {};
const sourcePending = { source: { pending: jest.fn(() => true), totalCount: jest.fn(() => 0), loaded: jest.fn(() => false) } };
const sourceLoaded = { source: { pending: jest.fn(() => false), totalCount: jest.fn(() => 1), loaded: jest.fn(() => true) } };

// rerender result list for generate correct state and prevState of recordsArePending
// trigger a new list of results: source isPending has to be TRUE first, than FALSE
const renderContracts = (stripes, props = {}, contractsData, rerender) => renderWithIntl(
  <MemoryRouter>
    <StripesContext.Provider value={stripes}>
      <ModuleHierarchyProvider module="@folio/idm-connect">
        <Contracts
          contentData={contractsData}
          selectedRecordId=""
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString="status.updated"
          visibleColumns={['status', 'lastName', 'firstName', 'uniLogin']}
          history={history}
          onSearchComplete={onSearchComplete}
          {...props}
          // stripes={{ hasPerm: () => true }}
        />
      </ModuleHierarchyProvider>
    </StripesContext.Provider>
  </MemoryRouter>,
  rerender
);

describe('Contracts SASQ View', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();

    renderContracts(stripes, sourceLoaded, contracts);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('check filters', () => {
    it('should be present status filter', () => {
      expect(document.querySelector('#filter-accordion-status')).toBeInTheDocument();
    });

    it('reset all button should be present', () => {
      expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
    });

    it('search field should be present', () => {
      expect(document.querySelector('#contractSearchField')).toBeInTheDocument();
    });

    it('submit button should be present', () => {
      expect(document.querySelector('#clickable-search-contracts')).toBeInTheDocument();
    });

    it('should translate the status of the two results', () => {
      expect(screen.queryAllByText('Draft').length).toEqual(2);
    });

    it('should sort the results', () => {
      const columnHeaderLastname = document.querySelector('#list-column-lastname');
      expect(columnHeaderLastname).toBeInTheDocument();
      expect(window.location.href.includes('sort=lastName')).toBeFalsy();

      userEvent.click(columnHeaderLastname);
      expect(window.location.href.includes('sort=-lastName')).toBeFalsy();
    });

    it('should close filter pane', () => {
      const collapseFilterButton = document.querySelector('[data-test-collapse-filter-pane-button]');
      expect(collapseFilterButton).toBeVisible();
      expect(document.querySelector('#pane-contract-filter')).toBeInTheDocument();

      userEvent.click(collapseFilterButton);
      expect(document.querySelector('#pane-contract-filter')).not.toBeInTheDocument();
    });
  });
});

describe('Contracts SASQ View - rerender result list', () => {
  let stripes;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();
  });

  describe('trigger search should load new results', () => {
    beforeEach(() => {
      renderWithIntlResult = renderContracts(
        stripes,
        sourcePending,
        contracts,
      );
    });

    it('should be present the list of results and columns of MCL', async () => {
      expect(document.querySelector('#pane-contract-results')).toBeInTheDocument();
      expect(screen.getByText('Walk in contracts')).toBeVisible();
      expect(document.querySelector('#list-column-status')).toBeInTheDocument();
      expect(screen.queryByText('Last name')).toBeInTheDocument();
      expect(screen.queryByText('First name')).toBeInTheDocument();
      expect(screen.queryByText('Uni login')).toBeInTheDocument();
    });

    it('should be present the actions menu', () => {
      const actionButton = document.querySelector('[data-test-pane-header-actions-button]');
      expect(actionButton).toBeVisible();
      userEvent.click(actionButton);
      expect(screen.getByRole('button', { name: 'Search IDM' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    });

    test('trigger search should return results', () => {
      const searchFieldInput = document.querySelector('#contractSearchField');
      userEvent.type(searchFieldInput, 'Hausmann');

      expect(document.querySelector('#clickable-search-contracts')).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      userEvent.click(screen.getByRole('button', { name: 'Search' }));

      renderContracts(
        stripes,
        sourceLoaded,
        contracts,
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-contracts .mclRowContainer > [role=row]').length).toEqual(1);
      expect(screen.queryByText('Lienhardt')).toBeInTheDocument();
    });
  });
});

describe('Contracts SASQ View - without results', () => {
  let stripes;
  beforeEach(() => {
    stripes = useStripes();

    renderContracts(stripes, {}, []);
  });

  it('should no results be visible', async () => {
    expect(screen.getByText('Walk in contracts')).toBeVisible();
    expect(document.querySelectorAll('#list-contracts .mclRowContainer > [role=row]').length).toEqual(0);
  });
});

describe('Contracts SASQ View - without permission', () => {
  beforeEach(() => {
    renderContracts({ hasPerm: () => false }, sourceLoaded, contracts);
  });
  it('should not display the new button', () => {
    expect(document.querySelector('#clickable-searchIdm')).toBeInTheDocument();
    expect(document.querySelector('#clickable-new')).not.toBeInTheDocument();
  });
});
