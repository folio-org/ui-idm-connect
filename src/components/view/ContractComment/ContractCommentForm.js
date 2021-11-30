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

class ContractCommentForm extends React.Component {
  render() {
    const { expanded, onToggle, accordionId } = this.props;

    return (
      <Accordion
        id={accordionId}
        label={<FormattedMessage id="ui-idm-connect.accordion.comment" />}
        onToggle={onToggle}
        open={expanded}
      >
        <Row>
          <Col xs={8}>
            <Field
              component={TextField}
              fullWidth
              id="addcontract_comment"
              label={<FormattedMessage id="ui-idm-connect.comment" />}
              name="comment"
              required
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

ContractCommentForm.propTypes = {
  accordionId: PropTypes.string.isRequired,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default ContractCommentForm;
