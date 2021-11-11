import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

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
      <ModuleHierarchyProvider module="@folio/erm-usage">
        <Contracts
          contentData={contractsData}
          selectedRecordId=""
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString="status.activated"
          visibleColumns={['status', 'lastName', 'firstName', 'uniLogin']}
          history={history}
          onSearchComplete={onSearchComplete}
          {...props}
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

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

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
      expect(screen.queryByText('Lastname')).toBeInTheDocument();
      expect(screen.queryByText('Firstname')).toBeInTheDocument();
      expect(screen.queryByText('Uni login')).toBeInTheDocument();
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

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    renderContracts(stripes, {}, []);
  });

  it('should no results be visible', async () => {
    expect(screen.getByText('Walk in contracts')).toBeVisible();
    expect(document.querySelectorAll('#list-contracts .mclRowContainer > [role=row]').length).toEqual(0);
  });
});
