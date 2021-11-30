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
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_lastname"
              label={<FormattedMessage id="ui-idm-connect.lastname" />}
              name="lastname"
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
              id="addcontract_firstname"
              label={<FormattedMessage id="ui-idm-connect.firstname" />}
              name="firstname"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_dateOfBirth"
              label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
              name="dateOfBirth"
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
