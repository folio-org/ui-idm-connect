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

class ContractContractView extends React.Component {
  static propTypes = {
    contract: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { contract, id } = this.props;

    return (
      <>
        <div id={id}>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.beginDate" />}
                value={_.get(contract, 'beginDate', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.endDate" />}
                value={_.get(contract, 'endDate', <NoValue />)}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default ContractContractView;
