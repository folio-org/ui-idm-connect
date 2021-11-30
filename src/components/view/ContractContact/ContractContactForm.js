import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

// import { Required } from '../../DisplayUtils/Validate';

class ContractContactForm extends React.Component {
  render() {
    const { expanded, onToggle, accordionId } = this.props;

    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-idm-connect.accordion.contact" />}
        onToggle={onToggle}
        open={expanded}
      >
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_email"
              label={<FormattedMessage id="ui-idm-connect.email" />}
              name="personal.email"
              required
              // validate={Required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_street"
              label={<FormattedMessage id="ui-idm-connect.street" />}
              name="personal.address.addressLine1"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_addition"
              label={<FormattedMessage id="ui-idm-connect.addition" />}
              name="personal.address.addressLine2"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_zipCode"
              label={<FormattedMessage id="ui-idm-connect.zipCode" />}
              name="personal.address.zipCode"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_city"
              label={<FormattedMessage id="ui-idm-connect.city" />}
              name="personal.address.city"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_country"
              label={<FormattedMessage id="ui-idm-connect.country" />}
              name="personal.address.country"
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

ContractContactForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ContractContactForm;
