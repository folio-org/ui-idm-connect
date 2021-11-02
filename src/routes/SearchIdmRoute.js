import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import urls from '../components/DisplayUtils/urls';
import SearchIdm from '../components/view/SearchIdm/SearchIdm';
import filterConfig from '../components/view/filterConfigData';

const INITIAL_RESULT_COUNT = 30;

class SearchIdmRoute extends React.Component {
  static manifest = Object.freeze({
    sources: {
      type: 'rest',
      root: 'http://localhost:8080/idm-connect',
      records: 'walkInContracts',
      path: 'walk-in-contracts',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(lastName="%{query.query}*" or firstName="%{query.query}*" or dateOfBirth="%{query.query}*")',
            {
              lastName: 'lastname',
              firstName: 'firstname',
              dateOfBirth: 'dateofbirth',
            },
            filterConfig,
            2
          ),
        },
        staticFallback: { params: {} },
      },
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  handleSubmit = () => {
    console.log('submit');
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.walkInContracts()}${location.search}`);
  }


  render() {
    // if (!this.state.hasPerms) {
    //   return (
    //     <Layout className="textCentered">
    //       <h2><FormattedMessage id="stripes-smart-components.permissionError" /></h2>
    //       <p><FormattedMessage id="stripes-smart-components.permissionsDoNotAllowAccess" /></p>
    //     </Layout>
    //   );
    // }

    return (
      <SearchIdm
        onSubmit={() => { this.handleSubmit(); }}
        // onCancel={() => { this.handleClose(); }}
        handlers={{
          onClose: this.handleClose,
        }}
      />
    );
  }
}

SearchIdmRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  }).isRequired,
};

export default stripesConnect(SearchIdmRoute);
