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

class WalkInContractPersonalView extends React.Component {
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
                label={<FormattedMessage id="ui-idm-connect.lastname" />}
                value={_.get(walkInContract, 'personal.lastName', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.firstname" />}
                value={_.get(walkInContract, 'personal.firstName', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
                value={_.get(walkInContract, 'personal.dateOfBirth', <NoValue />)}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default WalkInContractPersonalView;
