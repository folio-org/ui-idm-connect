import { MemoryRouter } from 'react-router-dom';

import {
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useStripes } from '@folio/stripes/core';

import contracts from '../../../test/jest/fixtures/contracts';
import renderWithIntl from '../../../test/jest/helpers/renderWithIntl';
import Contracts from './Contracts';

jest.mock('react-virtualized-auto-sizer', () => ({ children }) => children({ width: 1920, height: 1080 }));

const onSearchComplete = jest.fn();
const history = {};

let renderWithIntlResult = {};
const sourcePending = {
  source: {
    pending: jest.fn(() => true),
    totalCount: jest.fn(() => 0),
    loaded: jest.fn(() => false),
  },
};
const sourceLoaded = {
  source: {
    pending: jest.fn(() => false),
    totalCount: jest.fn(() => 1),
    loaded: jest.fn(() => true),
  },
};

// rerender result list for generate correct state and prevState of recordsArePending
// trigger a new list of results: source isPending has to be TRUE first, than FALSE
const renderContracts = (stripes, props = {}, contractsData, rerender) => renderWithIntl(
  <MemoryRouter>
    <Contracts
      contentData={contractsData}
      history={history}
      onNeedMoreData={jest.fn()}
      onSearchComplete={onSearchComplete}
      queryGetter={jest.fn()}
      querySetter={jest.fn()}
      searchString="status.updated"
      selectedRecordId=""
      stripes={stripes}
      visibleColumns={['status', 'lastName', 'firstName', 'uniLogin']}
      {...props}
    />
  </MemoryRouter>,
  rerender
);

describe('Contracts SASQ View', () => {
  let stripes;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    stripes = useStripes();

    renderContracts(stripes, sourceLoaded, contracts);
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

    it('should sort the results', async () => {
      const columnHeaderLastname = document.querySelector('#list-column-lastname');
      expect(columnHeaderLastname).toBeInTheDocument();
      expect(window.location.href.includes('sort=lastName')).toBeFalsy();

      await userEvent.click(columnHeaderLastname);
      expect(window.location.href.includes('sort=-lastName')).toBeFalsy();
    });

    it('should close filter pane', async () => {
      const collapseFilterButton = document.querySelector('[data-test-collapse-filter-pane-button]');
      expect(collapseFilterButton).toBeVisible();
      expect(document.querySelector('#pane-contract-filter')).toBeInTheDocument();

      await userEvent.click(collapseFilterButton);
      await waitFor(() => expect(document.querySelector('#pane-contract-filter')).not.toBeInTheDocument());
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
        contracts
      );
    });

    it('should be present the list of results and columns of MCL', async () => {
      expect(document.querySelector('#pane-contract-results')).toBeInTheDocument();
      expect(screen.getByText('Walk-in contracts')).toBeVisible();
      expect(document.querySelector('#list-column-status')).toBeInTheDocument();
      expect(screen.getByText('Last name')).toBeInTheDocument();
      expect(screen.getByText('First name')).toBeInTheDocument();
      expect(screen.getByText('Uni login')).toBeInTheDocument();
    });

    it('should be present the actions menu', async () => {
      const actionButton = document.querySelector('[data-test-pane-header-actions-button]');
      expect(actionButton).toBeVisible();
      await userEvent.click(actionButton);
      expect(screen.getByRole('button', { name: 'Search IDM' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Change card number' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
    });

    test('trigger search should return results', async () => {
      const searchFieldInput = document.querySelector('#contractSearchField');
      await userEvent.type(searchFieldInput, 'Hausmann');

      expect(document.querySelector('#clickable-search-contracts')).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: 'Search' }));

      renderContracts(
        stripes,
        sourceLoaded,
        contracts,
        renderWithIntlResult.rerender
      );

      expect(document.querySelectorAll('#list-contracts .mclRowContainer > [role=row]').length).toEqual(1);
      expect(screen.getByText('Lienhardt')).toBeInTheDocument();
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
    expect(screen.getByText('Walk-in contracts')).toBeVisible();
    expect(document.querySelectorAll('#list-contracts .mclRowContainer > [role=row]').length).toEqual(0);
  });
});

describe('Contracts SASQ View - permissions', () => {
  const getActionMenu = () => document.querySelector('[data-test-pane-header-actions-button]');
  const getMenuNew = () => document.querySelector('#clickable-new');
  const getMenuSearch = () => document.querySelector('#clickable-searchIdm');
  const getMenuChange = () => document.querySelector('#clickable-changeubreadernumber');
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
  });

  test('no permission', () => {
    renderContracts({ ...stripes, hasPerm: () => false }, sourceLoaded, contracts);
    expect(getActionMenu()).toBeNull();
    expect(getMenuNew()).not.toBeInTheDocument();
    expect(getMenuSearch()).not.toBeInTheDocument();
    expect(getMenuChange()).not.toBeInTheDocument();
  });

  test('searchidm permission', () => {
    renderContracts({ ...stripes, hasPerm: (p) => (p === 'ui-idm-connect.searchidm') }, sourceLoaded, contracts);
    expect(getActionMenu()).toBeVisible();
    expect(getMenuNew()).not.toBeInTheDocument();
    expect(getMenuSearch()).toBeInTheDocument();
    expect(getMenuChange()).not.toBeInTheDocument();
  });

  test('changeubreadernumber permission', () => {
    renderContracts(
      { ...stripes, hasPerm: (p) => (p === 'ui-idm-connect.changeubreadernumber') },
      sourceLoaded,
      contracts
    );
    expect(getActionMenu()).toBeVisible();
    expect(getMenuNew()).not.toBeInTheDocument();
    expect(getMenuSearch()).not.toBeInTheDocument();
    expect(getMenuChange()).toBeInTheDocument();
  });

  test('create permission', () => {
    renderContracts({ ...stripes, hasPerm: (p) => (p === 'ui-idm-connect.create') }, sourceLoaded, contracts);
    expect(getActionMenu()).toBeVisible();
    expect(getMenuNew()).toBeInTheDocument();
    expect(getMenuSearch()).not.toBeInTheDocument();
    expect(getMenuChange()).not.toBeInTheDocument();
  });
});
