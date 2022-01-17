import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getFormValues } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  CalloutContext,
  stripesConnect,
} from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import SearchIdm from '../components/view/SearchIdm/SearchIdm';

class SearchIdmRoute extends React.Component {
  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      renderListOfResults: false,
      isUsersResultsEmpty: false,
    };
  }

  sendCallout = (type, msg) => {
    this.context.sendCallout({
      type,
      message: (<FormattedMessage id="ui-idm-connect.searchIdm.error" values={{ msg }} />),
    });
  };

  fetchFolioUser = (id) => {
    const { stripes: { okapi } } = this.props;

    return fetch(`${okapi.url}/users?query=externalSystemId==${id}`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        this.sendCallout('error', <FormattedMessage id="ui-idm-connect.FOLIOUser" />);
        return Promise.reject(response);
      }
    }).catch((err) => {
      this.sendCallout('error', err.statusText);
      return Promise.reject(err);
    });
  }

  fetchIdmUser = (formValues) => {
    const { stripes: { okapi } } = this.props;

    return fetch(`${okapi.url}/idm-connect/searchidm?firstName=${formValues.firstname}&lastName=${formValues.lastname}&dateOfBirth=${moment(formValues.dateOfBirth).format('YYYY-MM-DD')}`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        this.sendCallout('error', '');
        return Promise.reject(response);
      }
    }).catch((err) => {
      this.sendCallout('error', err.statusText);
      return Promise.reject(err);
    });
  }

  mergeData = (idmUser, folioUsers) => {
    idmUser.folioUsers = folioUsers;
    return idmUser;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const formValues = getFormValues('SearchIdmForm')(this.props.stripes.store.getState()) || {};

    this.fetchIdmUser(formValues)
      .then(idmusers => idmusers.map(idmuser => this.fetchFolioUser(idmuser.unilogin).then(foliouser => this.mergeData(idmuser, foliouser))))
      .then(promises => Promise.all(promises))
      .then(result => {
        this.setState(() => ({
          users: result,
          renderListOfResults: true,
          isUsersResultsEmpty: false,
        }));
        if (_.get(result[0], 'msg', '') === 'User not found') {
          this.setState(() => ({
            isUsersResultsEmpty: true,
          }));
        }
      });
  }

  handleClose = () => {
    this.props.history.push(`${urls.contracts()}`);
  }

  render() {
    const isCreateNewUser = this.props.location.state === 'new';
    const formValues = getFormValues('SearchIdmForm')(this.props.stripes.store.getState()) || {};

    return (
      <SearchIdm
        handlers={{ onClose: this.handleClose }}
        isCreateNewUser={isCreateNewUser}
        isUsersResultsEmpty={this.state.isUsersResultsEmpty}
        onSubmit={this.handleSubmit}
        renderListOfResults={this.state.renderListOfResults}
        searchValues={formValues}
        users={this.state.users}
      />
    );
  }
}

SearchIdmRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.string.isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
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
