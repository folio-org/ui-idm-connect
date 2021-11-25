import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { Layout } from '@folio/stripes/components';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import urls from '../components/DisplayUtils/urls';
import Contracts from '../components/view/Contracts';
import filterConfig from '../components/view/filterConfigData';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class ContractsRoute extends React.Component {
  static manifest = Object.freeze({
    sources: {
      type: 'okapi',
      records: 'contracts',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'idm-connect/contract',
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(personal.lastName="%{query.query}*")',
            {
              status: 'status',
              lastName: 'lastname',
              firstName: 'firstname',
              uniLogin: 'unilogin',
            },
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
    mutator: PropTypes.shape({
      sources: PropTypes.shape({
        POST: PropTypes.func.isRequired
      }),
      query: PropTypes.shape({
        update: PropTypes.func
      }).isRequired
    }).isRequired,
    resources: PropTypes.shape({
      sources: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object)
      })
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();

    this.state = {
      hasPerms: props.stripes.hasPerm('ui-idm-connect.view'),
    };
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'sources');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const newCount = this.source.totalCount();
    const newRecords = this.source.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(prevProps, this.logger, 'sources');
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        history.push(`${urls.contractView(record.id)}${location.search}`);
      }
    }
  }

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  }

  queryGetter = () => {
    return _.get(this.props.resources, 'query', {});
  }

  handleNeedMoreData = () => {
    if (this.source) {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  render() {
    const { location, match, children } = this.props;

    if (this.source) {
      this.source.update(this.props, 'sources');
    }

    if (!this.state.hasPerms) {
      return (
        <Layout className="textCentered">
          <h2><FormattedMessage id="stripes-smart-components.permissionError" /></h2>
          <p><FormattedMessage id="stripes-smart-components.permissionsDoNotAllowAccess" /></p>
        </Layout>
      );
    }

    return (
      <Contracts
        contentData={_.get(this.props.resources, 'sources.records', [])}
        onNeedMoreData={this.handleNeedMoreData}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchString={location.search}
        selectedRecordId={match.params.id}
        source={this.source}
      >
        {children}
      </Contracts>
    );
  }
}

export default stripesConnect(ContractsRoute);
