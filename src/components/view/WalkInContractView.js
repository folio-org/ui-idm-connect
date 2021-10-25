import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  Layout,
  NoValue,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import WalkInContractInfoView from './WalkInContractInfo/WalkInContractInfoView';

class WalkInContractView extends React.Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEdit: PropTypes.func,
    }).isRequired,
    isLoading: PropTypes.bool,
    record: PropTypes.object,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.editButton = React.createRef();
  }

  renderEditPaneMenu = () => {
    const { canEdit, handlers } = this.props;

    return (
      <PaneMenu>
        {canEdit && (
          <Button
            aria-label={<FormattedMessage id="ui-idm-connect.edit" />}
            buttonRef={this.editButton}
            buttonStyle="primary"
            id="clickable-edit-walkInContract"
            marginBottom0
            onClick={handlers.onEdit}
          >
            <FormattedMessage id="ui-idm-connect.edit" />
          </Button>
        )}
      </PaneMenu>
    );
  }

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        dismissible
        id="pane-walkInContractDetails"
        onClose={this.props.handlers.onClose}
        paneTitle={<span>loading</span>}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  }

  render() {
    const { record, isLoading } = this.props;
    const label = _.get(record, 'label', <NoValue />);

    if (isLoading) return this.renderLoadingPane();

    return (
      <>
        <Pane
          defaultWidth="40%"
          dismissible
          id="pane-walkInContractDetails"
          lastMenu={this.renderEditPaneMenu()}
          onClose={this.props.handlers.onClose}
          paneTitle={<span data-test-walkInContract-header-title>{label}</span>}
        >
          <ViewMetaData
            metadata={_.get(record, 'metadata', {})}
            stripes={this.props.stripes}
          />
          <WalkInContractInfoView
            id="walkInContractInfo"
            walkInContract={record}
            stripes={this.props.stripes}
          />
        </Pane>
      </>
    );
  }
}


export default WalkInContractView;
