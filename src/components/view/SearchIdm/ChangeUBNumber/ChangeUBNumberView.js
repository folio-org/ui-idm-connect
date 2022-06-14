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

import getInitialValues from './Helper';

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

  renderUbreadernumberMessage(initialUBReaderNumber) {
    const {
      invalid,
      pristine,
      submitting,
      values,
    } = this.props;

    const noChange = pristine || submitting || invalid;

    { /* Warning yellow: existing value is cleared */ }
    { /* TODO: change the effective Card number to 845000000000." */ }
    if (!noChange && (Object.keys(values).length === 0) && initialUBReaderNumber) {
      console.log('value is cleared');
      return (
        <MessageBanner type="warning">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.cleared" />
        </MessageBanner>
      );
    { /* Success green: existing value is changed */ }
    { /* TODO: change the effective Card number to 4-560000001." */ }
    } else if (!noChange && Object.keys(values).length > 0 && initialUBReaderNumber) {
      console.log('value is changed');
      return (
        <MessageBanner type="success">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.updated" />
        </MessageBanner>
      );
    { /* Success green: value is added */ }
    { /* TODO: change the effective Card number to 4-560000099." */ }
    } else if (!noChange && Object.keys(values).length > 0 && _.isEmpty(initialUBReaderNumber)) {
      console.log('value is added');
      return (
        <MessageBanner type="success">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.added" />
        </MessageBanner>
      );
    { /* Default grey: no change */ }
    } else {
      console.log('no changed');
      return (
        <MessageBanner style={{ background: 'grey', color: 'black' }}>
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.noChange" />
        </MessageBanner>
      );
    }
  }

  render() {
    const adaptedInitialValues = getInitialValues();
    const initialUBReaderNumber = _.get(adaptedInitialValues, 'UBReaderNumber', '');

    return (
      <form
        id="form-change-ub-number"
        onSubmit={this.props.handleSubmit}
      >
        <Pane
          data-testid="changeUBNumberView"
          dismissible
          footer={this.getPaneFooter()}
          onClose={this.props.handlers.onClose}
          paneTitle={<FormattedMessage id="ui-idm-connect.ubreadernumber.edit" />}
          defaultWidth="fill"
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
            id="field-change-ub-number"
            initialValue={initialUBReaderNumber}
            label={<FormattedMessage id="ui-idm-connect.UBReaderNumber" />}
            name="UBReaderNumber"
          />
          {this.renderUbreadernumberMessage(initialUBReaderNumber)}
        </Pane>
      </form>
    );
  }
}


export default stripesFinalForm({
  initialValuesEqual: (a, b) => _.isEqual(a, b),
  enableReinitialize: true,
  subscription: {
    values: true,
    invalid: true,
  },
})(ChangeUBNumberView);
