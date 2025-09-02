import PropTypes from 'prop-types';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  CalloutContext,
  stripesConnect,
} from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import ChangeUBNumberView from '../components/view/SearchIdm/ChangeUBNumber/ChangeUBNumberView';
import getInitialValues from '../components/view/SearchIdm/ChangeUBNumber/getInitialValues';
import fetchWithDefaultOptions from '../util/fetchWithDefaultOptions';

const ChangeUBNumberViewRoute = ({
  history,
  stripes,
}) => {
  const callout = useContext(CalloutContext);

  const handleClose = () => {
    // remove item
    localStorage.removeItem('idmConnectChangeUBNumber');
    history.push(`${urls.changeUBNumber()}`);
  };

  const handleSubmit = (newUBReaderNumber) => {
    const adaptedInitialValues = getInitialValues();
    const uniLogin = adaptedInitialValues.uniLogin;
    const fetchMethod = Object.keys(newUBReaderNumber).length === 0 ? 'DELETE' : 'POST';
    const fetchPath = Object.keys(newUBReaderNumber).length === 0 ?
      `/idm-connect/ubreadernumber?unilogin=${uniLogin}` :
      `/idm-connect/ubreadernumber?unilogin=${uniLogin}&UBReaderNumber=${newUBReaderNumber.UBReaderNumber}`;

    if (uniLogin) {
      // TODO: re-write with ky useOkapiKy!!!
      return fetchWithDefaultOptions(stripes.okapi, fetchPath, {
        method: fetchMethod,
      }).then((response) => {
        if (response.ok) {
          // go back for fetching the new data
          localStorage.removeItem('idmConnectChangeUBNumber');
          history.push(`${urls.contracts()}`);
          callout.sendCallout({
            type: 'success',
            message: <FormattedMessage id="ui-idm-connect.ubreadernumber.update.success" />,
          });
        } else {
          callout.sendCallout({
            type: 'error',
            message: <FormattedMessage id="ui-idm-connect.ubreadernumber.update.error" values={{ error: '' }} />,
          });
        }
      })
        .catch((err) => {
          callout.sendCallout({
            type: 'error',
            message: <FormattedMessage id="ui-idm-connect.ubreadernumber.update.error" values={{ error: err.statusText }} />,
          });
        });
    }

    return null;
  };

  return (
    <ChangeUBNumberView
      handlers={{ onClose: handleClose }}
      onSubmit={handleSubmit}
      stripes={stripes}
    />
  );
};

ChangeUBNumberViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      url: PropTypes.string,
    }),
  }).isRequired,
};

export default stripesConnect(ChangeUBNumberViewRoute);
