import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { getFormValues } from 'redux-form';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import SearchIdm from '../components/view/SearchIdm/SearchIdm';
import { fetchFolioUser, fetchIdmUser, mergeData } from '../util/handler';

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
      message: msg,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const formValues = getFormValues('SearchIdmForm')(this.props.stripes.store.getState()) || {};

    fetchIdmUser(formValues, this.props.stripes.okapi, this.context)
      .then(idmusers => idmusers.map(idmuser => fetchFolioUser(idmuser.unilogin, this.props.stripes.okapi, this.context).then(foliouser => mergeData(idmuser, foliouser))))
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
