import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Datepicker,
  Row,
  TextField,
} from '@folio/stripes/components';

import Required from '../../DisplayUtils/Validate';

class ContractPersonalForm extends React.Component {
  render() {
    const { expanded, onToggle, accordionId } = this.props;

    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-idm-connect.accordion.personal" />}
        onToggle={onToggle}
        open={expanded}
      >
        <Row>
          <Col xs={2}>
            <Field
              component={TextField}
              id="addcontract_lastname"
              label={<FormattedMessage id="ui-idm-connect.lastname" />}
              name="lastname"
              required
              validate={Required}
            />
          </Col>
          <Col xs={4}>
            <Field
              component={TextField}
              id="addcontract_firstname"
              label={<FormattedMessage id="ui-idm-connect.firstname" />}
              name="firstname"
              required
              validate={Required}
            />
          </Col>
          <Col xs={2}>
            <Field
              component={TextField}
              id="addcontract_academicTitle"
              label={<FormattedMessage id="ui-idm-connect.academicTitle" />}
              name="academicTitle"
            />
          </Col>
          <Col xs={2}>
            <Field
              component={Datepicker}
              id="addcontract_dateOfBirth"
              label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
              name="dateOfBirth"
              required
              validate={Required}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

ContractPersonalForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ContractPersonalForm;
