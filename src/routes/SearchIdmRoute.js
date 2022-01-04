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
    }).then(async (res) => {
      if (res.ok) {
        await res.json().then((folioUserResult) => {
          if (folioUserResult.totalRecords === 1) {
            // display name of user in users app:
            const folioUserName = `${folioUserResult.users[0].personal.lastName}, ${folioUserResult.users[0].personal.firstName}`;
            // id for link to user in users app:
            const folioUserId = folioUserResult.users[0].id;

            const usersArray = [...this.state.users];
            const newUserItem = { ...this.state.users[index], folioUserName, folioUserId };
            usersArray[index] = newUserItem;
            this.setState(() => ({
              users: usersArray,
            }));
          } else if (folioUserResult.totalRecords >= 1) {
            const multipleFolioUserWithId = folioUserResult.users[0].externalSystemId;

            const usersArray = [...this.state.users];
            const userItem = { ...usersArray[index] };
            const newUserItem = { ...userItem, multipleFolioUserWithId };
            usersArray[index] = newUserItem;
            this.setState(() => ({
              users: usersArray,
            }));
          }
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
    }).then(async (response) => {
      if (response.ok) {
        await response.json().then((json) => {
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
            // fetch folioUser for every id
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
