import _ from 'lodash';
import React from 'react';
import {
  withRouter,
  Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
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

class Contracts extends React.Component {
  static propTypes = {
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
    searchString: PropTypes.string,
    selectedRecordId: PropTypes.string,
    source: PropTypes.object,
    syncToLocationSearch: PropTypes.bool,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
    })
  };

  static defaultProps = {
    contentData: {},
    searchString: '',
    syncToLocationSearch: true,
  }

  constructor(props) {
    super(props);

    this.state = {
      filterPaneIsVisible: true,
    };
  }

  resultsFormatter = {
    status: source => DataLable(_.get(source, 'status', '')),
    lastName: source => source.personal.lastName,
    firstName: source => source.personal.firstName,
    uniLogin: source => source.uniLogin,
  };

  rowFormatter = (row) => {
    const { rowClass, rowData, rowIndex, rowProps = {}, cells } = row;
    const RowComponent = Link;
    rowProps.to = this.rowURL(rowData.id);

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
  }

  // generate url for record-details
  rowURL = (id) => {
    return `${urls.contractView(id)}${this.props.searchString}`;
    // NEED FILTER: "status.active,status.technical implementation,status.request,status.negotiation"
  }

  // fade in/out of filter-pane
  toggleFilterPane = () => {
    this.setState(curState => ({
      filterPaneIsVisible: !curState.filterPaneIsVisible,
    }));
  }

  // fade in / out the filter menu
  renderResultsFirstMenu = (filters) => {
    const { filterPaneIsVisible } = this.state;
    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
    if (filterPaneIsVisible) {
      return null;
    }

    return (
      <PaneMenu>
        <ExpandFilterPaneButton
          filterCount={filterCount}
          onClick={this.toggleFilterPane}
        />
      </PaneMenu>
    );
  }

  // counting records of result list
  renderResultsPaneSubtitle = (source) => {
    if (source && source.loaded()) {
      const count = source ? source.totalCount() : 0;
      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
    }

    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
  }

  getActionMenu = () => ({ onToggle }) => {
    const canSearch = this.props.stripes.hasPerm('ui-idm-connect.searchidm');
    const canChange = this.props.stripes.hasPerm('ui-idm-connect.changeubreadernumber');
    const canCreate = this.props.stripes.hasPerm('ui-idm-connect.create');
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
                    this.props.history.push({
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
                    this.props.history.push({
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
                    this.props.history.push({
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
  }

  renderIsEmptyMessage = (query, source) => {
    if (!source) {
      return <FormattedMessage id="ui-idm-connect.noSourceYet" />;
    }

    return (
      <div>
        <NoResultsMessage
          source={source}
          searchTerm={query.query || ''}
          filterPaneIsVisible
          toggleFilterPane={_.noop}
        />
      </div>
    );
  };

  renderFilterPaneHeader = () => {
    return (
      <PaneHeader
        lastMenu={
          <PaneMenu>
            <CollapseFilterPaneButton
              onClick={this.toggleFilterPane}
            />
          </PaneMenu>
        }
        paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
      />
    );
  };

  renderResultsPaneHeader = (activeFilters, source) => {
    return (
      <PaneHeader
        actionMenu={this.getActionMenu()}
        appIcon={<AppIcon app="idm-connect" />}
        firstMenu={this.renderResultsFirstMenu(activeFilters)}
        paneSub={this.renderResultsPaneSubtitle(source)}
        paneTitle={<FormattedMessage id="ui-idm-connect.contracts" />}
      />
    );
  };

  render() {
    const {
      intl,
      queryGetter,
      querySetter,
      onNeedMoreData,
      onSelectRow,
      selectedRecordId,
      source,
      syncToLocationSearch
    } = this.props;
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
                  {this.state.filterPaneIsVisible &&
                    <Pane
                      defaultWidth="18%"
                      id="pane-contract-filter"
                      renderHeader={this.renderFilterPaneHeader}
                    >
                      <form onSubmit={onSubmitSearch}>
                        <div>
                          <SearchField
                            ariaLabel={intl.formatMessage({ id: 'ui-idm-connect.searchInputLabel' })}
                            autoFocus
                            id="contractSearchField"
                            inputRef={this.searchField}
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
                    renderHeader={() => this.renderResultsPaneHeader(activeFilters, source)}
                  >
                    <MultiColumnList
                      autosize
                      columnMapping={{
                        status: <FormattedMessage id="ui-idm-connect.status" />,
                        lastName: <FormattedMessage id="ui-idm-connect.lastname" />,
                        firstName: <FormattedMessage id="ui-idm-connect.firstname" />,
                        uniLogin: <FormattedMessage id="ui-idm-connect.uniLogin" />,
                      }}
                      contentData={this.props.contentData}
                      formatter={this.resultsFormatter}
                      id="list-contracts"
                      isEmptyMessage={this.renderIsEmptyMessage(query, source)}
                      isSelected={({ item }) => item.id === selectedRecordId}
                      onHeaderClick={onSort}
                      onNeedMoreData={onNeedMoreData}
                      onRowClick={onSelectRow}
                      rowFormatter={this.rowFormatter}
                      sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                      sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                      totalCount={count}
                      virtualize
                      visibleColumns={['status', 'lastName', 'firstName', 'uniLogin']}
                    />
                  </Pane>
                  {this.props.children}
                </Paneset>
              );
            }
          }
        </SearchAndSortQuery>
      </div>
    );
  }
}

export default injectIntl(withRouter(Contracts));
