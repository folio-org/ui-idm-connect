import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';

import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryFunction,
  StripesConnectedSource,
} from '@folio/stripes/smart-components';

import NoPermissionsMessage from '../components/DisplayUtils/NoPermissionsMessage';
import urls from '../components/DisplayUtils/urls';
import usePrevious from '../components/hooks/usePrevious';
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

  const [count, setCount] = useState(source.totalCount());
  const [records, setRecords] = useState(source.records());

  const previousCount = usePrevious(count);
  const previousRecords = usePrevious(records);

  useEffect(() => {
    source.update({ resources, mutator }, 'sources');

    setCount(source.totalCount());
    setRecords(source.records());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources, mutator]);

  useEffect(() => {
    if (count === 1) {
      if (previousCount !== 1 || (previousCount === 1 && previousRecords[0].id !== records[0].id)) {
        const record = records[0];
        history.push(`${urls.contractView(record.id)}${location.search}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, records]);

  useEffect(() => {
    searchField.current?.focus();
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
    return <NoPermissionsMessage />;
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
