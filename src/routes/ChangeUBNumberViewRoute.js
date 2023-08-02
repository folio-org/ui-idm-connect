import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { FormattedMessage } from 'react-intl';

import {
  stripesConnect,
  CalloutContext,
} from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import ChangeUBNumberView from '../components/view/SearchIdm/ChangeUBNumber/ChangeUBNumberView';
import getInitialValues from '../components/view/SearchIdm/ChangeUBNumber/getInitialValues';
import fetchWithDefaultOptions from '../util/fetchWithDefaultOptions';

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

  static contextType = CalloutContext;

  sendCallout = (type, msg) => {
    this.context.sendCallout({
      type,
      message: msg,
    });
  }

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
      `/idm-connect/ubreadernumber?unilogin=${uniLogin}` :
      `/idm-connect/ubreadernumber?unilogin=${uniLogin}&UBReaderNumber=${newUBReaderNumber.UBReaderNumber}`;

    if (uniLogin) {
      return fetchWithDefaultOptions(okapi, fetchPath, {
        method: fetchMethod,
      }).then((response) => {
        if (response.ok) {
          // go back for fetching the new data
          localStorage.removeItem('idmConnectChangeUBNumber');
          this.props.history.push(`${urls.contracts()}`);
          this.context.sendCallout({
            type: 'success',
            message: <FormattedMessage id="ui-idm-connect.ubreadernumber.update.success" />,
          });
        } else {
          this.context.sendCallout({
            type: 'error',
            message: <FormattedMessage id="ui-idm-connect.ubreadernumber.update.error" values={{ error: '' }} />,
          });
        }
      }).catch((err) => {
        this.context.sendCallout({
          type: 'error',
          message: <FormattedMessage id="ui-idm-connect.ubreadernumber.update.error" values={{ error: err.statusText }} />,
        });
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
