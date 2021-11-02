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

class WalkInContractHeaderView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    walkInContract: PropTypes.object,
  };

  getDataLable(field) {
    const fieldValue = _.get(this.props.walkInContract, field, '');
    if (fieldValue !== 'pending') {
      return <FormattedMessage id={`ui-idm-connect.dataOption.${fieldValue}`} />;
    } else {
      return <NoValue />;
    }
  }

  render() {
    const { walkInContract, id } = this.props;
    const statusLabel = this.getDataLable('status');

    return (
      <>
        <div id={id}>
          <Row className={css.walkInContractHeader}>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.status" />}
                value={statusLabel}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.uniLogin" />}
                value={_.get(walkInContract, 'uniLogin', <NoValue />)}
              />
            </Col>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-idm-connect.libraryCard" />}
                value={_.get(walkInContract, 'libraryCard', <NoValue />)}
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default WalkInContractHeaderView;
