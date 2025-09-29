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

const ContractPersonalView = ({
  contract,
  id,
}) => {
  const dateOfBirth = get(contract, 'personal.dateOfBirth');

  return (
    <>
      <div id={id}>
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.lastname" />}
              value={get(contract, 'personal.lastName', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.firstname" />}
              value={get(contract, 'personal.firstName', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}>
              {dateOfBirth ? <FormattedDate timeZone="UTC" value={dateOfBirth} /> : <NoValue />}
            </KeyValue>
          </Col>
        </Row>
      </div>
    </>
  );
};

ContractPersonalView.propTypes = {
  contract: PropTypes.object,
  id: PropTypes.string,
};

export default ContractPersonalView;
