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

class ContractContractForm extends React.Component {
  render() {
    const { expanded, onToggle, accordionId } = this.props;

    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-idm-connect.accordion.contract" />}
        onToggle={onToggle}
        open={expanded}
      >
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_beginDate"
              label={<FormattedMessage id="ui-idm-connect.beginDate" />}
              name="beginDate"
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
              id="addcontract_endDate"
              label={<FormattedMessage id="ui-idm-connect.endDate" />}
              name="endDate"
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

ContractContractForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ContractContractForm;
