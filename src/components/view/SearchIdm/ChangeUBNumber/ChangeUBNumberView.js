import {
  get,
  isEmpty,
} from 'lodash';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  KeyValue,
  MessageBanner,
  NoValue,
  Pane,
  PaneFooter,
  PaneHeader,
  Row,
  TextField,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import getInitialValues from './getInitialValues';

const ChangeUBNumberView = ({
  handlers: { onClose },
  handleSubmit,
  invalid,
  pristine,
  submitting,
  values,
}) => {
  const getPaneFooter = () => {
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
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderEnd={endButton} renderStart={startButton} />;
  };

  const renderUbreadernumberMessage = (initialUBReaderNumber, isStatusActive) => {
    const noChange = pristine || invalid;
    const adaptedInitialValues = getInitialValues();
    const uniCardNumber = get(adaptedInitialValues, 'cardReaderNumber', <NoValue />);
    const libraryCardNumber = values?.UBReaderNumber ?? <NoValue />;
    const accountState = get(adaptedInitialValues, 'status', <NoValue />);

    if (!isStatusActive) {
      // Warning red: account state is not active
      return (
        <MessageBanner id="msg-ubreadernumber-statusNotActive" type="error">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.statusNotActive" values={{ accountState }} />
        </MessageBanner>
      );
    } else if (!noChange && (Object.keys(values).length === 0) && initialUBReaderNumber) {
      // Warning yellow: existing value is cleared
      // should change the effective Card number to uni card number
      return (
        <MessageBanner id="msg-ubreadernumber-cleared" type="warning">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.cleared" /><br />
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.cleared.changeInfo" values={{ uniCardNumber }} />
        </MessageBanner>
      );
    } else if (!noChange && Object.keys(values).length > 0 && initialUBReaderNumber) {
      // Success green: existing value is changed
      // should change the effective Card number library card number
      return (
        <MessageBanner id="msg-ubreadernumber-updated" type="success">
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.updated" /><br />
          <FormattedMessage id="ui-idm-connect.ubreadernumber.text.updated.changeInfo" values={{ libraryCardNumber }} />
        </MessageBanner>
      );
    } else if (!noChange && Object.keys(values).length > 0 && isEmpty(initialUBReaderNumber)) {
      // Success green: value is added
      // should change the effective Card number to uni card number
      return (
        <MessageBanner id="msg-ubreadernumber-added" type="success">
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
  };

  const renderPaneHeader = () => {
    return (
      <PaneHeader
        dismissible
        onClose={onClose}
        paneTitle={<FormattedMessage id="ui-idm-connect.ubreadernumber.edit" />}
      />
    );
  };

  const adaptedInitialValues = getInitialValues();
  const initialUBReaderNumber = get(adaptedInitialValues, 'UBReaderNumber', '');
  const allowedStatuses = [
    'Aktives Uni-Login',
    'Uni-Login ohne Vertrag (inaktiv)',
    'Uni-Login ohne Vertrag (in Karenzzeit)',
  ];

  const isStatusActive = allowedStatuses.includes(get(adaptedInitialValues, 'status'));

  return (
    <form
      id="form-change-ub-number"
      onSubmit={handleSubmit}
      style={{ width: '100%' }}
    >
      <Pane
        defaultWidth="50%"
        footer={getPaneFooter()}
        renderHeader={renderPaneHeader}
      >
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.lastname" />}
              value={get(adaptedInitialValues, 'personal.lastName', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.firstname" />}
              value={get(adaptedInitialValues, 'personal.firstName', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
              value={get(adaptedInitialValues, 'personal.dateOfBirth', <NoValue />)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.accountState" />}
              value={get(adaptedInitialValues, 'status', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.ULAffiliation" />}
              value={get(adaptedInitialValues, 'ULAffiliation', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.UBRole" />}
              value={get(adaptedInitialValues, 'UBRole', <NoValue />)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.uniLogin" />}
              value={get(adaptedInitialValues, 'uniLogin', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.cardReaderNumber" />}
              value={get(adaptedInitialValues, 'cardReaderNumber', <NoValue />)}
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
        {renderUbreadernumberMessage(initialUBReaderNumber, isStatusActive)}
      </Pane>
    </form>
  );
};

ChangeUBNumberView.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.object,
};

export default stripesFinalForm({
  subscription: {
    values: true,
    invalid: true,
  },
})(ChangeUBNumberView);
