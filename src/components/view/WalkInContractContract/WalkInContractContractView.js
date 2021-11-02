import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

class WalkInContractContractView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    walkInContract: PropTypes.object,
  };

  render() {
    const { walkInContract, id } = this.props;

    return (
      <>
        <div id={id}>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.beginDate" />}
                value={_.get(walkInContract, 'beginDate', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.endDate" />}
                value={_.get(walkInContract, 'endDate', <NoValue />)}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default WalkInContractContractView;
