import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';

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
    const beginDate = _.get(contract, 'beginDate');
    const endDate = _.get(contract, 'endDate');

    return (
      <>
        <div id={id}>
          <Row>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-idm-connect.beginDate" />}>
                {beginDate ? <FormattedDate value={beginDate} timeZone="UTC" /> : <NoValue />}
              </KeyValue>
            </Col>
            <Col xs={5}>
              <KeyValue label={<FormattedMessage id="ui-idm-connect.endDate" />}>
                {endDate ? <FormattedDate value={endDate} timeZone="UTC" /> : <NoValue />}
              </KeyValue>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default ContractContractView;
