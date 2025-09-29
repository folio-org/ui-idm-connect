import { get } from 'lodash';
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

const ContractContractView = ({
  contract,
  id,
}) => {
  const beginDate = get(contract, 'beginDate');
  const endDate = get(contract, 'endDate');

  return (
    <>
      <div id={id}>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-idm-connect.beginDate" />}>
              {beginDate ? <FormattedDate timeZone="UTC" value={beginDate} /> : <NoValue />}
            </KeyValue>
          </Col>
          <Col xs={5}>
            <KeyValue label={<FormattedMessage id="ui-idm-connect.endDate" />}>
              {endDate ? <FormattedDate timeZone="UTC" value={endDate} /> : <NoValue />}
            </KeyValue>
          </Col>
        </Row>
      </div>
    </>
  );
};

ContractContractView.propTypes = {
  contract: PropTypes.object,
  id: PropTypes.string,
};

export default ContractContractView;
