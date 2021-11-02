import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

class WalkInContractCommentView extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    walkInContract: PropTypes.object,
  };

  render() {
    const { walkInContract, id } = this.props;

    return (
      <>
        <div id={id}>
          <Row>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.comment" />}
              value={_.get(walkInContract, 'comment', <NoValue />)}
            />
          </Row>
        </div>
      </>
    );
  }
}

export default WalkInContractCommentView;
