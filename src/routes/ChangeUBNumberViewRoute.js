import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import ChangeUBNumberView from '../components/view/SearchIdm/ChangeUBNumber/ChangeUBNumberView';
import getInitialValues from '../components/view/SearchIdm/ChangeUBNumber/Helper';

class ChangeUBNumberViewRoute extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    stripes: PropTypes.shape({
      okapi: PropTypes.shape({
        tenant: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
        url: PropTypes.string,
      }),
    }).isRequired,
  };

  handleClose = () => {
    // remove item
    localStorage.removeItem('idmConnectChangeUBNumber');
    this.props.history.push(`${urls.changeUBNumber()}`);
  }

  handleSubmit = (newUBReaderNumber) => {
    const { stripes: { okapi } } = this.props;
    const adaptedInitialValues = getInitialValues();
    const uniLogin = adaptedInitialValues.uniLogin;
    const fetchMethod = Object.keys(newUBReaderNumber).length === 0 ? 'DELETE' : 'POST';
    const fetchPath = Object.keys(newUBReaderNumber).length === 0 ?
      `${okapi.url}/idm-connect/ubreadernumber?unilogin=${uniLogin}` :
      `${okapi.url}/idm-connect/ubreadernumber?unilogin=${uniLogin}&UBReaderNumber=${newUBReaderNumber.UBReaderNumber}`;

    if (uniLogin) {
      return fetch(fetchPath, {
        headers: {
          'X-Okapi-Tenant': okapi.tenant,
          'X-Okapi-Token': okapi.token,
        },
        method: fetchMethod,
      }).then((response) => {
        // TODO: close complete changeUBNumberView or fetch again the data of the search request
        if (response.ok) {
          this.handleClose();
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
    return null;
  }

  render() {
    return (
      <ChangeUBNumberView
        handlers={{
          onClose: this.handleClose,
        }}
        onSubmit={this.handleSubmit}
        stripes={this.props.stripes}
      />
    );
  }
}

export default stripesConnect(ChangeUBNumberViewRoute);
