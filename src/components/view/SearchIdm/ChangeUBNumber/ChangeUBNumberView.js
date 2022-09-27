import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Col,
  KeyValue,
  MessageBanner,
  NoValue,
  Pane,
  PaneFooter,
  Row,
  TextField,
} from '@folio/stripes/components';

import getInitialValues from './getInitialValues';

class ChangeUBNumberView extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    values: PropTypes.object,
  };

  getPaneFooter() {
    const {
      handlers: { onClose },
      handleSubmit,
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
        buttonStyle="default mega"
        id="close-change-ub-number-form"
        marginBottom0
        onClick={onClose}
      >
        <FormattedMessage id="ui-idm-connect.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        disabled={disabled}
        id="submit-change-ub-number-form"
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="ui-idm-connect.form.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
  }

  renderUbreadernumberMessage(initialUBReaderNumber, isStatusActive) {
    const {
      invalid,
      pristine,
      values,
    } = this.props;

    const noChange = pristine || invalid;

    const adaptedInitialValues = getInitialValues();
    const uniCardNumber = _.get(adaptedInitialValues, 'cardReaderNumber', <NoValue />);
    const libraryCardNumber = values?.UBReaderNumber ?? <NoValue />;
    const accountState = _.get(adaptedInitialValues, 'status', <NoValue />);

    if (!isStatusActive) {
      // Warning red: account state is not active
      return (
        <MessageBanner type="error" id="msg-ubreadernumber-statusNotActive">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.statusNotActive" values={{ accountState }} />
        </MessageBanner>
      );
    } else if (!noChange && (Object.keys(values).length === 0) && initialUBReaderNumber) {
      // Warning yellow: existing value is cleared
      // should change the effective Card number to uni card number
      return (
        <MessageBanner type="warning" id="msg-ubreadernumber-cleared">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.cleared" /><br />
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.cleared.changeInfo" values={{ uniCardNumber }} />
        </MessageBanner>
      );
    } else if (!noChange && Object.keys(values).length > 0 && initialUBReaderNumber) {
      // Success green: existing value is changed
      // should change the effective Card number library card number
      return (
        <MessageBanner type="success" id="msg-ubreadernumber-updated">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.updated" /><br />
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.updated.changeInfo" values={{ libraryCardNumber }} />
        </MessageBanner>
      );
    } else if (!noChange && Object.keys(values).length > 0 && _.isEmpty(initialUBReaderNumber)) {
      // Success green: value is added
      // should change the effective Card number to uni card number
      return (
        <MessageBanner type="success" id="msg-ubreadernumber-added">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.added" /><br />
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.added.changeInfo" values={{ libraryCardNumber }} />
        </MessageBanner>
      );
    } else if (noChange) {
      // Default grey: no change
      return (
        <MessageBanner style={{ background: 'lightGray', color: 'black' }}>
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.noChange" />
        </MessageBanner>
      );
    } else {
      return null;
    }
  }

  render() {
    const adaptedInitialValues = getInitialValues();
    const initialUBReaderNumber = _.get(adaptedInitialValues, 'UBReaderNumber', '');
    const isStatusActive = _.get(adaptedInitialValues, 'status') === 'Aktives Uni-Login';

    return (
      <form
        id="form-change-ub-number"
        onSubmit={this.props.handleSubmit}
        style={{ width: '100%' }}
      >
        <Pane
          data-testid="changeUBNumberView"
          defaultWidth="50%"
          dismissible
          footer={this.getPaneFooter()}
          onClose={this.props.handlers.onClose}
          paneTitle={<FormattedMessage id="ui-idm-connect.ubreadernumber.edit" />}
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
          <Field
            component={TextField}
            disabled={!isStatusActive}
            id="field-change-ub-number"
            initialValue={initialUBReaderNumber}
            label={<FormattedMessage id="ui-idm-connect.UBReaderNumber" />}
            name="UBReaderNumber"
          />
          {this.renderUbreadernumberMessage(initialUBReaderNumber, isStatusActive)}
        </Pane>
      </form>
    );
  }
}

export default stripesFinalForm({
  subscription: {
    values: true,
    invalid: true,
  },
})(ChangeUBNumberView);
