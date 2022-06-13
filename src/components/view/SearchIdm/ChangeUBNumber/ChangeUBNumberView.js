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

  render() {
    // const adaptedInitialValues = this.getInitialValues();
    const adaptedInitialValues = getInitialValues();

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
            {/* <Field
              component={TextField}
              id="field-changeUbNumber"
              label={<FormattedMessage id="ui-idm-connect.uniLogin" />}
              name="uniLogin"
            /> */}
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
                label={<FormattedMessage id="ui-idm-connect.UBReaderNumber" />}
                value={_.get(adaptedInitialValues, 'UBReaderNumber', <NoValue />)}
              />
            </Col>
          </Row>
          <Field
            component={TextField}
            id="field-change-ub-number"
            label={<FormattedMessage id="ui-idm-connect.UBReaderNumber" />}
            name="UBReaderNumber"
          />
        </Pane>
      </form>
    );
  }
}


export default stripesFinalForm({
  initialValuesEqual: (a, b) => _.isEqual(a, b),
  enableReinitialize: true,
})(ChangeUBNumberView);
