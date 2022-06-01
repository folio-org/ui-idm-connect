import React from 'react';
import PropTypes from 'prop-types';

import {
  Col,
  Pane,
  Row,
} from '@folio/stripes/components';

class ChangeUBNumberView extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }).isRequired,
  };


  render() {
    return (
      <>
        <Pane
          data-testid="changeUBNumberView"
          // onClose={onClose}
          paneTitle="View UB number"
          defaultWidth="40%"
        >
          <Row>
            <Col>
              <div>
                Change UB Number View
              </div>
            </Col>
          </Row>
        </Pane>
      </>
    );
  }
}


export default ChangeUBNumberView;
