import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  TextArea,
} from '@folio/stripes/components';

const ContractCommentForm = ({
  expanded,
  onToggle,
  accordionId,
}) => {
  return (
    <Accordion
      id={accordionId}
      label={<FormattedMessage id="ui-idm-connect.accordion.comment" />}
      onToggle={onToggle}
      open={expanded}
    >
      <Row>
        <Col xs={10}>
          <Field
            component={TextArea}
            id="addcontract_comment"
            label={<FormattedMessage id="ui-idm-connect.comment" />}
            name="comment"
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ContractCommentForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ContractCommentForm;
