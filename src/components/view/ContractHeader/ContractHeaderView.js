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

import css from './Header.css';
import DataLable from '../../DisplayUtils/Format';

class ContractHeaderView extends React.Component {
  static propTypes = {
    contract: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { contract, id } = this.props;
    const statusLabel = DataLable(_.get(this.props.contract, 'status', ''));

    return (
      <>
        <div id={id}>
          <Row className={css.contractHeader}>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.status" />}
                value={statusLabel}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.uniLogin" />}
                value={_.get(contract, 'uniLogin', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.libraryCard" />}
                value={_.get(contract, 'libraryCard', <NoValue />)}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default ContractHeaderView;
