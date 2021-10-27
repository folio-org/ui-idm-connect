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

class WalkInContractContactView extends React.Component {
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
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.email" />}
              value={_.get(walkInContract, 'personal.email', <NoValue />)}
            />
          </Row>
          <Row><FormattedMessage id="ui-idm-connect.address" /></Row>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.street" />}
                value={_.get(walkInContract, 'personal.address.addressLine1', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.addition" />}
                value={_.get(walkInContract, 'personal.address.addressLine2', <NoValue />)}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.zipCode" />}
                value={_.get(walkInContract, 'personal.address.zipCode', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.city" />}
                value={_.get(walkInContract, 'personal.address.city', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.country" />}
                value={_.get(walkInContract, 'personal.address.country', <NoValue />)}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default WalkInContractContactView;
