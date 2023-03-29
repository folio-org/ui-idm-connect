import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { getFormValues } from 'redux-form';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import ChangeUBNumber from '../components/view/SearchIdm/ChangeUBNumber/ChangeUBNumber';
import { fetchFolioUser, fetchIdmUser, mergeData } from '../util/handler';

class ChangeUBNumberRoute extends React.Component {
  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      renderListOfResults: false,
      isUsersResultsEmpty: false,
    };
  }

  doSendCallout = (type, msg) => {
    this.context.sendCallout({
      type,
      message: msg,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const formValues = getFormValues('ChangeUBNumberForm')(this.props.stripes.store.getState()) || {};

    fetchIdmUser(formValues, this.props.stripes.okapi, this.context)
      .then(
        (response) => {
          if (response.status >= 400) {
            // ERROR
            this.doSendCallout('error', `Error: ${response.statusText}`);
            return null;
          } else {
            // SUCCESS return data
            return response.json();
          }
        },
      )
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
      })
      .catch(() => {
        this.doSendCallout('error', 'Error');
      });
  }

  handleClose = () => {
    this.props.history.push(`${urls.contracts()}`);
  }

  render() {
    const formValues = getFormValues('ChangeUBNumberForm')(this.props.stripes.store.getState()) || {};

    return (
      <ChangeUBNumber
        handlers={{ onClose: this.handleClose }}
        isUsersResultsEmpty={this.state.isUsersResultsEmpty}
        onSubmit={this.handleSubmit}
        renderListOfResults={this.state.renderListOfResults}
        searchValues={formValues}
        users={this.state.users}
      >
        {this.props.children}
      </ChangeUBNumber>
    );
  }
}

ChangeUBNumberRoute.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
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

export default stripesConnect(ChangeUBNumberRoute);
