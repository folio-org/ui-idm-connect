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

import { Required } from '../../DisplayUtils/Validate';

const ContractContractForm = ({
  accordionId,
  disableLibraryCard,
  expanded,
  onToggle,
}) => {
  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-idm-connect.accordion.contract" />}
      onToggle={onToggle}
      open={expanded}
    >
      <Row>
        <Col xs={2}>
          <Field
            backendDateStandard="YYYY-MM-DD"
            component={Datepicker}
            id="addcontract_endDate"
            label={<FormattedMessage id="ui-idm-connect.endDate" />}
            name="endDate"
            required
            timeZone="UTC"
            validate={Required}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            disabled={disableLibraryCard}
            id="addcontract_libraryCard"
            label={<FormattedMessage id="ui-idm-connect.libraryCard" />}
            name="libraryCard"
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            disabled
            id="addcontract_uniLogin"
            label={<FormattedMessage id="ui-idm-connect.uniLogin" />}
            name="uniLogin"
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ContractContractForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  disableLibraryCard: PropTypes.bool,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ContractContractForm;
