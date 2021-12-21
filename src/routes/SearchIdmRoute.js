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

  handleSubmit = (e) => {
    const { stripes: { okapi } } = this.props;
    const formValues = getFormValues('SearchIdmForm')(this.props.stripes.store.getState()) || {};

    e.preventDefault();

    fetch(`${okapi.url}/idm-connect/searchidm?firstName=${formValues.firstname}&lastName=${formValues.lastname}&dateOfBirth=${moment(formValues.dateOfBirth).format('YYYY-MM-DD')}`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          this.setState(() => ({
            users: json,
            renderListOfResults: true,
            isUsersResultsEmpty: false,
          }));
          if (_.get(json[0], 'msg', '') === 'User not found') {
            this.setState(() => ({
              isUsersResultsEmpty: true,
            }));
          }
        });
      } else {
        this.sendCallout('error', '');
      }
    }).catch((err) => {
      this.sendCallout('error', err);
    });
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.contracts()}${location.search}`);
  }

  render() {
    const { location } = this.props;
    const isCreateNewUser = this.props.location.state === 'new';

    return (
      <SearchIdm
        onSubmit={this.handleSubmit}
        handlers={{ onClose: this.handleClose }}
        // history={history}
        users={this.state.users}
        renderListOfResults={this.state.renderListOfResults}
        searchString={location.search}
        isCreateNewUser={isCreateNewUser}
        isUsersResultsEmpty={this.state.isUsersResultsEmpty}
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
