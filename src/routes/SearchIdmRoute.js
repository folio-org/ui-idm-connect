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

  fetchFolioUser = (id, index) => {
    const { stripes: { okapi } } = this.props;

    fetch(`${okapi.url}/users?query=externalSystemId==${id}`, {
      headers: {
        'X-Okapi-Tenant': okapi.tenant,
        'X-Okapi-Token': okapi.token,
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((folioUserResult) => {
          const usersArray = [...this.state.users];
          let newUserItem = { ...this.state.users[index] };

          if (folioUserResult.totalRecords === 1) {
            const folioUserName = `${folioUserResult.users[0].personal.lastName}, ${folioUserResult.users[0].personal.firstName}`;
            const folioUserId = folioUserResult.users[0].id;
            newUserItem = { ...usersArray[index], folioUserName, folioUserId };
          } else if (folioUserResult.totalRecords >= 1) {
            const multipleFolioUserWithId = folioUserResult.users[0].externalSystemId;
            newUserItem = { ...usersArray[index], multipleFolioUserWithId };
          }
          usersArray[index] = newUserItem;
          this.setState(() => ({
            users: usersArray,
          }));
        });
      }
    });
  }

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
          if (this.props.location.state !== 'new') {
            const uniIds = json.map((user) => user.unilogin);
            uniIds.map((id, index) => this.fetchFolioUser(id, index));
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
    this.props.history.push(`${urls.contracts()}`);
  }

  render() {
    const isCreateNewUser = this.props.location.state === 'new';

    return (
      <SearchIdm
        handlers={{ onClose: this.handleClose }}
        isCreateNewUser={isCreateNewUser}
        isUsersResultsEmpty={this.state.isUsersResultsEmpty}
        onSubmit={this.handleSubmit}
        renderListOfResults={this.state.renderListOfResults}
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
