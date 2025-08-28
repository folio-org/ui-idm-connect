import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';
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

const ContractsRoute = ({
  children,
  history,
  location,
  match,
  mutator,
  resources,
  stripes,
}) => {
  const hasPerms = stripes.hasPerm('ui-idm-connect.view');
  const searchField = useRef();
  const [source] = useState(() => {
    // Create initial source
    return new StripesConnectedSource({ resources, mutator }, stripes.logger, 'sources');
  });


  useEffect(() => {
    const oldCount = source.totalCount();
    const oldRecords = source.records();
    // Update source when resources or mutator change
    source?.update({ resources, mutator }, 'sources');

    const newCount = source.totalCount();
    const newRecords = source.records();

    if (newCount === 1) {
      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        history.push(`${urls.collectionView(record.id)}${location.search}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, mutator]);


  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  const querySetter = ({ nsValues }) => {
    mutator.query.update(nsValues);
  };

  const queryGetter = () => {
    return get(resources, 'query', {});
  };

  const handleNeedMoreData = () => {
    if (source) {
      source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  if (!hasPerms) {
    return (
      <Layout className="textCentered">
        <h2><FormattedMessage id="stripes-smart-components.permissionError" /></h2>
        <p><FormattedMessage id="stripes-smart-components.permissionsDoNotAllowAccess" /></p>
      </Layout>
    );
  }

  return (
    <Contracts
      contentData={get(resources, 'sources.records', [])}
      onNeedMoreData={handleNeedMoreData}
      queryGetter={queryGetter}
      querySetter={querySetter}
      searchString={location.search}
      selectedRecordId={match.params.id}
      source={source}
      stripes={stripes}
    >
      {children}
    </Contracts>
  );
};

ContractsRoute.manifest = Object.freeze({
  sources: {
    type: 'okapi',
    records: 'contracts',
    recordsRequired: '%{resultCount}',
    resourceShouldRefresh: true,
    perRequest: 30,
    path: 'idm-connect/contract',
    GET: {
      params: {
        query: makeQueryFunction(
          'cql.allRecords=1',
          '(personal.lastName="%{query.query}*")',
          {
            status: 'status',
            lastName: 'personal.lastName',
            firstName: 'personal.firstName',
            uniLogin: 'uniLogin',
          },
          filterConfig,
          2,
        ),
      },
      staticFallback: { params: {} },
    },
  },
  query: {
    initialValue: {
      query: '',
      filters: 'status.updated',
      sort: 'lastName'
    }
  },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
});

ContractsRoute.propTypes = {
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
};

export default stripesConnect(ContractsRoute);
