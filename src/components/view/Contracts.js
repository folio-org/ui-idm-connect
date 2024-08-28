import PropTypes from 'prop-types';
import { get, noop } from 'lodash';
import { useState } from 'react';
import {
  withRouter,
  Link,
} from 'react-router-dom';
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';

import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortQuery,
  SearchAndSortNoResultsMessage as NoResultsMessage,
} from '@folio/stripes/smart-components';
import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  PaneHeader,
  PaneMenu,
  Paneset,
  SearchField,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import urls from '../DisplayUtils/urls';
import ContractsFilters from './ContractsFilters';
import DataLable from '../DisplayUtils/Format';

const Contracts = ({
  children,
  contentData = {},
  history,
  intl,
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  searchField,
  searchString = '',
  selectedRecordId,
  source,
  stripes,
  syncToLocationSearch = true,
}) => {
  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);

  const resultsFormatter = {
    status: result => DataLable(get(result, 'status', '')),
    lastName: result => result.personal.lastName,
    firstName: result => result.personal.firstName,
    uniLogin: result => result.uniLogin,
  };

  // generate url for record-details
  const rowURL = (id) => {
    return `${urls.contractView(id)}${searchString}`;
    // NEED FILTER: "status.active,status.technical implementation,status.request,status.negotiation"
  };

  const rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;
    const RowComponent = Link;
    rowProps.to = rowURL(rowData.id);

    return (
      <RowComponent
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[
          rowData.name,
        ]}
        key={`row-${rowIndex}`}
        role="row"
        {...rowProps}
      >
        {cells}
      </RowComponent>
    );
  };

  // fade in/out of filter-pane
  const toggleFilterPane = () => {
    setFilterPaneIsVisible((curState) => !curState);
  };

  // fade in / out the filter menu
  const renderResultsFirstMenu = (filters) => {
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={toggleFilterPane}
        />
      </PaneMenu>
    );
  };

  // counting records of result list
  const renderResultsPaneSubtitle = (results) => {
    if (results?.loaded()) {
      const count = results ? results.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  };

  // eslint-disable-next-line react/prop-types
  const getActionMenu = () => ({ onToggle }) => {
    const canSearch = stripes.hasPerm('ui-idm-connect.searchidm');
    const canChange = stripes.hasPerm('ui-idm-connect.changeubreadernumber');
    const canCreate = stripes.hasPerm('ui-idm-connect.create');
    if (canSearch || canCreate || canChange) {
      return (
        <>
          { canSearch && (
            <FormattedMessage id="ui-idm-connect.searchIdm.title">
              {ariaLabel => (
                <Button
                  aria-label={ariaLabel}
                  buttonStyle="dropdownItem"
                  id="clickable-searchIdm"
                  marginBottom0
                  onClick={() => {
                    history.push({
                      pathname: `${urls.searchIdm()}`,
                      state: 'search'
                    });
                    onToggle();
                  }}
                >
                  <FormattedMessage id="ui-idm-connect.searchIdm.title" />
                </Button>
              )}
            </FormattedMessage>
          )}
          { canChange && (
            <FormattedMessage id="ui-idm-connect.ubreadernumber.change">
              {ariaLabel => (
                <Button
                  aria-label={ariaLabel}
                  buttonStyle="dropdownItem"
                  id="clickable-changeubreadernumber"
                  marginBottom0
                  onClick={() => {
                    history.push({
                      pathname: `${urls.changeUBNumber()}`,
                    });
                    onToggle();
                  }}
                >
                  <FormattedMessage id="ui-idm-connect.ubreadernumber.change" />
                </Button>
              )}
            </FormattedMessage>
          )}
          { canCreate && (
            <FormattedMessage id="ui-idm-connect.new">
              {ariaLabel => (
                <Button
                  aria-label={ariaLabel}
                  buttonStyle="dropdownItem"
                  id="clickable-new"
                  marginBottom0
                  onClick={() => {
                    history.push({
                      pathname: `${urls.searchIdm()}`,
                      state: 'new'
                    });
                    onToggle();
                  }}
                >
                  <FormattedMessage id="ui-idm-connect.new" />
                </Button>
              )}
            </FormattedMessage>
          )}
        </>
      );
    } else {
      return null;
    }
  };

  const renderIsEmptyMessage = (query, result) => {
    if (!result) {
      return <FormattedMessage id="ui-idm-connect.noSourceYet" />;
    }

    return (
      <div>
        <NoResultsMessage
          source={result}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={noop}
        />
      </div>
    );
  };

  const renderFilterPaneHeader = () => {
    return (
      <PaneHeader
        lastMenu={
          <PaneMenu>
            <CollapseFilterPaneButton
              onClick={toggleFilterPane}
            />
          </PaneMenu>
        }
        paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
      />
    );
  };

  const renderResultsPaneHeader = (activeFilters, result) => {
    return (
      <PaneHeader
        actionMenu={getActionMenu()}
        appIcon={<AppIcon app="idm-connect" />}
        firstMenu={renderResultsFirstMenu(activeFilters)}
        paneSub={renderResultsPaneSubtitle(result)}
        paneTitle={<FormattedMessage id="ui-idm-connect.contracts" />}
      />
    );
  };

  const count = source ? source.totalCount() : 0;
  const query = queryGetter() || {};
  const sortOrder = query.sort || '';

  return (
    <div data-testid="contracts">
      <SearchAndSortQuery
        initialFilterState={{ status: ['updated'] }}
        initialSearchState={{ query: '' }}
        initialSortState={{ sort: 'lastName' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        syncToLocationSearch={syncToLocationSearch}
      >
        {
          ({
            activeFilters,
            filterChanged,
            getFilterHandlers,
            getSearchHandlers,
            onSort,
            onSubmitSearch,
            resetAll,
            searchChanged,
            searchValue,
          }) => {
            const disableReset = () => !filterChanged && !searchChanged;

            return (
              <Paneset>
                {filterPaneIsVisible &&
                  <Pane
                    defaultWidth="18%"
                    id="pane-contract-filter"
                    renderHeader={renderFilterPaneHeader}
                  >
                    <form onSubmit={onSubmitSearch}>
                      <div>
                        <SearchField
                          ariaLabel={intl.formatMessage({ id: 'ui-idm-connect.searchInputLabel' })}
                          autoFocus
                          id="contractSearchField"
                          inputRef={searchField}
                          name="query"
                          onChange={getSearchHandlers().query}
                          onClear={getSearchHandlers().reset}
                          value={searchValue.query}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={!searchValue.query || searchValue.query === ''}
                          fullWidth
                          id="clickable-search-contracts"
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <Button
                        buttonStyle="none"
                        disabled={disableReset()}
                        id="clickable-reset-all"
                        onClick={resetAll}
                      >
                        <Icon icon="times-circle-solid">
                          <FormattedMessage id="stripes-smart-components.resetAll" />
                        </Icon>
                      </Button>
                      <ContractsFilters
                        activeFilters={activeFilters.state}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  defaultWidth="fill"
                  id="pane-contract-results"
                  padContent={false}
                  noOverflow
                  renderHeader={() => renderResultsPaneHeader(activeFilters, source)}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      status: <FormattedMessage id="ui-idm-connect.status" />,
                      lastName: <FormattedMessage id="ui-idm-connect.lastname" />,
                      firstName: <FormattedMessage id="ui-idm-connect.firstname" />,
                      uniLogin: <FormattedMessage id="ui-idm-connect.uniLogin" />,
                    }}
                    contentData={contentData}
                    formatter={resultsFormatter}
                    id="list-contracts"
                    isEmptyMessage={renderIsEmptyMessage(query, source)}
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    onRowClick={onSelectRow}
                    rowFormatter={rowFormatter}
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={['status', 'lastName', 'firstName', 'uniLogin']}
                  />
                </Pane>
                {children}
              </Paneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
};

Contracts.propTypes = {
  children: PropTypes.object,
  contentData: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }),
  onNeedMoreData: PropTypes.func,
  onSelectRow: PropTypes.func,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  searchField: PropTypes.object,
  searchString: PropTypes.string,
  selectedRecordId: PropTypes.string,
  source: PropTypes.object,
  syncToLocationSearch: PropTypes.bool,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  })
};

export default injectIntl(withRouter(Contracts));
