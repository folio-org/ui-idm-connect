import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

class WalkInContractInfoView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    walkInContract: PropTypes.object,
  };

  getDataLable(field) {
    const fieldValue = _.get(this.props.walkInContract, field, '');
    if (fieldValue !== '') {
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
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.lastname" />}
              value={_.get(walkInContract, 'lastName', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.firstname" />}
              value={_.get(walkInContract, 'firstName', <NoValue />)}
            />
          </Row>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.status" />}
              value={statusLabel}
            />
          </Row>
        </div>
      </>
    );
  }
}

export default WalkInContractInfoView;
