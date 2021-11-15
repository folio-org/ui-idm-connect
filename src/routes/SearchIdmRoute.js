import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { getFormValues } from 'redux-form';

import urls from '../components/DisplayUtils/urls';
import SearchIdm from '../components/view/SearchIdm/SearchIdm';

class SearchIdmRoute extends React.Component {
  handleSubmit = (values) => {
    const { stripes: { okapi } } = this.props;

    // console.log('values');
    // console.log(values);

    const formValues = getFormValues('myForm')(this.props.stripes.store.getState()) || {};
    console.log('formValues');
    console.log(formValues);

    fetch(`${okapi.url}/idm-connect/searchidm`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    });
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.contracts()}${location.search}`);
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
        onSubmit={this.handleSubmit}
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
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      url: PropTypes.string,
    }),
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

export default stripesConnect(SearchIdmRoute);
