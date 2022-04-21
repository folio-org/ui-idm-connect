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

class ContractPersonalView extends React.Component {
  static propTypes = {
    contract: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { contract, id } = this.props;
    const dateOfBirth = _.get(contract, 'personal.dateOfBirth');

    return (
      <>
        <div id={id}>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.lastname" />}
                value={_.get(contract, 'personal.lastName', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.firstname" />}
                value={_.get(contract, 'personal.firstName', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}>
                {dateOfBirth ? <FormattedDate value={dateOfBirth} timeZone="UTC" /> : <NoValue />}
              </KeyValue>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default ContractPersonalView;
