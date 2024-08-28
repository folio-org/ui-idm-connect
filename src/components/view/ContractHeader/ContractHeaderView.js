import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import css from './Header.css';
import DataLable from '../../DisplayUtils/Format';

const ContractHeaderView = ({
  contract,
  id,
}) => {
  const statusLabel = DataLable(get(contract, 'status', ''));

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
              value={get(contract, 'uniLogin', <NoValue />)}
            />
          </Col>
          <Col xs={4}>
            <KeyValue
              label={<FormattedMessage id="ui-idm-connect.libraryCard" />}
              value={get(contract, 'libraryCard', <NoValue />)}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

ContractHeaderView.propTypes = {
  contract: PropTypes.object,
  id: PropTypes.string,
};

export default ContractHeaderView;
