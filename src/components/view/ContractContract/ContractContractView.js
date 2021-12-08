import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import FormatDate from '../../DisplayUtils/Formate';

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
                value={FormatDate(contract, 'beginDate')}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.endDate" />}
                value={FormatDate(contract, 'endDate')}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default ContractContractView;
