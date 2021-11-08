import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

class ContractCommentView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    contract: PropTypes.object,
  };

  render() {
    const { contract, id } = this.props;

    return (
      <>
        <div id={id}>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.comment" />}
              value={_.get(contract, 'comment', <NoValue />)}
            />
          </Row>
        </div>
      </>
    );
  }
}

export default ContractCommentView;
