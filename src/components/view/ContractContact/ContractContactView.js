import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Label,
  NoValue,
  Row,
} from '@folio/stripes/components';

const ContractContactView = ({
  contract,
  id,
}) => {
  return (
    <>
      <div id={id}>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-idm-connect.email" />}
            value={get(contract, 'personal.email', <NoValue />)}
          />
        </Row>
        <Row>
          <Label>
            <FormattedMessage id="ui-idm-connect.address" />
          </Label>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.street" />}
              value={get(contract, 'personal.address.addressLine1', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.addition" />}
              value={get(contract, 'personal.address.addressLine2', <NoValue />)}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.zipCode" />}
              value={get(contract, 'personal.address.zipCode', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.city" />}
              value={get(contract, 'personal.address.city', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.country" />}
              value={get(contract, 'personal.address.country', <NoValue />)}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

ContractContactView.propTypes = {
  contract: PropTypes.object,
  id: PropTypes.string,
};

export default ContractContactView;
