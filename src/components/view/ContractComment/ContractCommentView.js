import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

const ContractCommentView = ({
  contract,
  id,
}) => {
  return (
    <>
      <div id={id}>
        <Row>
          <KeyValue
            label={<FormattedMessage id="ui-idm-connect.comment" />}
            value={get(contract, 'comment', <NoValue />)}
          />
        </Row>
      </div>
    </>
  );
};

ContractCommentView.propTypes = {
  contract: PropTypes.object,
  id: PropTypes.string,
};

export default ContractCommentView;
