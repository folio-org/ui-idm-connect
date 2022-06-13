import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import {
  Col,
  KeyValue,
  NoValue,
  Pane,
  Row,
} from '@folio/stripes/components';

class ChangeUBNumberView extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }).isRequired,
  };

  getInitialValues = () => {
    const initialValues = JSON.parse(localStorage.getItem('idmConnectChangeUBNumber'));

    return {
      personal: {
        lastName: initialValues.surname,
        firstName: initialValues.givenname,
        dateOfBirth: moment(initialValues.dateOfBirth).format('YYYY-MM-DD'),
      },
      status: initialValues.accountState,
      ULAffiliation: initialValues.ULAffiliation,
      UBRole: initialValues.UBRole ? <FormattedMessage id="ui-idm-connect.yes" /> : <FormattedMessage id="ui-idm-connect.no" />,
      uniLogin: initialValues.unilogin,
      UBReaderNumber: initialValues.UBReaderNumber,
      cardReaderNumber: initialValues.cardReaderNumber,
    };
  }

  render() {
    const adaptedInitialValues = this.getInitialValues();

    return (
      <>
        <Pane
          data-testid="changeUBNumberView"
          // onClose={onClose}
          paneTitle={<FormattedMessage id="ui-idm-connect.ubreadernumber.edit" />}
          defaultWidth="40%"
        >
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.lastname" />}
                value={_.get(adaptedInitialValues, 'personal.lastName', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.firstname" />}
                value={_.get(adaptedInitialValues, 'personal.firstName', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
                value={_.get(adaptedInitialValues, 'personal.dateOfBirth', <NoValue />)}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.accountState" />}
                value={_.get(adaptedInitialValues, 'status', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.ULAffiliation" />}
                value={_.get(adaptedInitialValues, 'ULAffiliation', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.UBRole" />}
                value={_.get(adaptedInitialValues, 'UBRole', <NoValue />)}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.uniLogin" />}
                value={_.get(adaptedInitialValues, 'uniLogin', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.cardReaderNumber" />}
                value={_.get(adaptedInitialValues, 'cardReaderNumber', <NoValue />)}
              />
            </Col>
          </Row>
          {/* TODO remove here when finished */}
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.libraryCard" />}
                value={_.get(adaptedInitialValues, 'libraryCard', <NoValue />)}
              />
            </Col>
          </Row>
        </Pane>
      </>
    );
  }
}


export default ChangeUBNumberView;
