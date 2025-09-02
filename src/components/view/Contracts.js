import {
  get,
  isEqual,
  noop,
} from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import {
  Link,
  withRouter,
} from 'react-router-dom';

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
import {
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortNoResultsMessage as NoResultsMessage,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';

import DataLable from '../DisplayUtils/Format';
import urls from '../DisplayUtils/urls';
import ContractsFilters from './ContractsFilters';

const defaultFilter = { status: ['updated'] };
const defaultSearch = { query: '' };
const defaultSort = { sort: 'lastName' };

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
        key={`row-${rowIndex}`}
        aria-rowindex={rowIndex + 2}
        className={rowClass}
        data-label={[rowData.name]}
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
                      state: 'search',
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
                      state: 'new',
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
          filterPaneIsVisible
          searchTerm={query.query || ''}
          source={result}
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
        initialFilterState={defaultFilter}
        initialSearchState={defaultSearch}
        initialSortState={defaultSort}
        queryGetter={queryGetter}
        querySetter={querySetter}
        setQueryOnMount
      >
        {
          ({
            activeFilters,
            getFilterHandlers,
            getSearchHandlers,
            onSort,
            onSubmitSearch,
            resetAll,
            searchValue,
          }) => {
            const filterChanged = !isEqual(activeFilters.state, defaultFilter);
            const searchChanged = searchValue.query && !isEqual(searchValue, defaultSearch);

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
                          onChange={(e) => {
                            if (e.target.value) {
                              getSearchHandlers().query(e);
                            } else {
                              getSearchHandlers().reset();
                            }
                          }}
                          onClear={getSearchHandlers().reset}
                          value={searchValue.query}
                        />
                        <Button
                          buttonStyle="primary"
                          disabled={!searchChanged}
                          fullWidth
                          id="clickable-search-contracts"
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <Button
                        buttonStyle="none"
                        disabled={!(filterChanged || searchChanged)}
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
                  noOverflow
                  padContent={false}
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
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }),
  syncToLocationSearch: PropTypes.bool,
};

export default injectIntl(withRouter(Contracts));
