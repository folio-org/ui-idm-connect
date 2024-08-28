import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Label,
  Row,
  TextField,
} from '@folio/stripes/components';

import {
  NoDollarBackslash,
  RequiredMail,
  RequiredNoDollarBackslash,
} from '../../DisplayUtils/Validate';
import BasicCss from '../BasicStyle.css';

const ContractContactForm = ({
  accordionId,
  expanded,
  onToggle,
}) => {
  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-idm-connect.accordion.contact" />}
      onToggle={onToggle}
      open={expanded}
    >
      <Row>
        <Col xs={3}>
          <Field
            component={TextField}
            id="addcontract_email"
            label={<FormattedMessage id="ui-idm-connect.email" />}
            name="personal.email"
            required
            validate={RequiredMail}
          />
        </Col>
      </Row>
      <Row>
        <Label className={BasicCss.styleForFormLabel}>
          <FormattedMessage id="ui-idm-connect.address" />
        </Label>
      </Row>
      <Row>
        <Col xs={3}>
          <Field
            component={TextField}
            id="addcontract_street"
            label={<FormattedMessage id="ui-idm-connect.street" />}
            name="personal.address.addressLine1"
            required
            validate={RequiredNoDollarBackslash}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            id="addcontract_addition"
            label={<FormattedMessage id="ui-idm-connect.addition" />}
            name="personal.address.addressLine2"
            validate={NoDollarBackslash}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <Field
            component={TextField}
            id="addcontract_zipCode"
            label={<FormattedMessage id="ui-idm-connect.zipCode" />}
            name="personal.address.zipCode"
            required
            validate={RequiredNoDollarBackslash}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            id="addcontract_city"
            label={<FormattedMessage id="ui-idm-connect.city" />}
            name="personal.address.city"
            required
            validate={RequiredNoDollarBackslash}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            id="addcontract_country"
            label={<FormattedMessage id="ui-idm-connect.country" />}
            name="personal.address.country"
            required
            validate={RequiredNoDollarBackslash}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ContractContactForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ContractContactForm;
