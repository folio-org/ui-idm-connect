import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Headline,
  Icon,
  Layout,
  Pane,
  PaneHeader,
  Row,
} from '@folio/stripes/components';

import ContractHeaderView from './ContractHeader/ContractHeaderView';
import ContractPersonalView from './ContractPersonal/ContractPersonalView';
import ContractContractView from './ContractContract/ContractContractView';
import ContractContactView from './ContractContact/ContractContactView';
import ContractCommentView from './ContractComment/ContractCommentView';

class ContractView extends React.Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    canDelete: PropTypes.bool,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEdit: PropTypes.func,
      onDelete: PropTypes.func,
    }).isRequired,
    isLoading: PropTypes.bool,
    record: PropTypes.object,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.editButton = React.createRef();

    this.state = {
      confirmDelete: false,
      accordions: {
        personalAccordion: false,
        contractAccordion: false,
        contactAccordion: false,
        commentAccordion: false,
      },
    };
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);

      newState.accordions = obj;
      return newState;
    });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);

      if (!_.has(newState.accordions, id)) newState.accordions[id] = true;
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  renderLoadingPanePaneHeader = () => {
    return (
      <PaneHeader
        dismissible
        onClose={this.props.handlers.onClose}
        paneTitle={<span>loading</span>}
      />
    );
  };

  renderDetailsPanePaneHeader = () => {
    const { record } = this.props;
    const fullName = `${_.get(record, 'personal.lastName')}, ${_.get(record, 'personal.firstName')}`;

    return (
      <PaneHeader
        actionMenu={this.getActionMenu()}
        dismissible
        onClose={this.props.handlers.onClose}
        paneTitle={<span>{fullName}</span>}
      />
    );
  };

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-contractDetails"
        renderHeader={this.renderLoadingPanePaneHeader}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  }

  beginDelete = () => {
    this.setState({
      confirmDelete: true,
    });
  }

  confirmDelete = (confirmation) => {
    if (confirmation) {
      this.props.handlers.onDelete();
    } else {
      this.setState({ confirmDelete: false });
    }
  }

  getActionMenu = () => ({ onToggle }) => {
    const { record, handlers, canEdit, canDelete } = this.props;
    const { confirmDelete } = this.state;
    const fullName = `${_.get(record, 'personal.lastName')}, ${_.get(record, 'personal.firstName')}`;
    const isStatusDraft = _.get(record, 'status') === 'draft';

    if (canEdit || (canDelete && isStatusDraft)) {
      return (
        <>
          {canEdit && (
            <FormattedMessage id="ui-idm-connect.edit">
              {ariaLabel => (
                <Button
                  aria-label={ariaLabel}
                  buttonStyle="dropdownItem"
                  id="clickable-edit-contract"
                  marginBottom0
                  onClick={() => { handlers.onEdit(); }}
                >
                  <Icon icon="edit">
                    <FormattedMessage id="ui-idm-connect.edit" />
                  </Icon>
                </Button>
              )}
            </FormattedMessage>
          )}
          {canDelete && isStatusDraft && (
            <FormattedMessage id="ui-idm-connect.delete">
              {ariaLabel => (
                <Button
                  aria-label={ariaLabel}
                  buttonStyle="dropdownItem"
                  id="clickable-delete-contract"
                  marginBottom0
                  onClick={() => {
                    this.beginDelete();
                    onToggle();
                  }}
                >
                  <Icon icon="trash">
                    <FormattedMessage id="ui-idm-connect.delete" />
                  </Icon>
                </Button>
              )}
            </FormattedMessage>
          )}
          <ConfirmationModal
            buttonStyle="danger"
            confirmLabel={<FormattedMessage id="ui-idm-connect.delete" />}
            heading={<FormattedMessage id="ui-idm-connect.delete" />}
            id="delete-collection-confirmation"
            message={<FormattedMessage
              id="ui-idm-connect.delete.confirm.message"
              values={{ fullName }}
            />}
            onCancel={() => { this.confirmDelete(false); }}
            onConfirm={() => { this.confirmDelete(true); }}
            open={confirmDelete}
          />
        </>
      );
    } else {
      return null;
    }
  };

  render() {
    const { record, isLoading } = this.props;
    const fullName = `${_.get(record, 'personal.lastName')}, ${_.get(record, 'personal.firstName')}`;

    if (isLoading) return this.renderLoadingPane();

    return (
      <>
        <Pane
          defaultWidth="40%"
          id="pane-contractDetails"
          renderHeader={this.renderDetailsPanePaneHeader}
        >
          <ContractHeaderView
            contract={record}
            id="contractHeader"
            stripes={this.props.stripes}
          />
          <Row>
            <Col xs={12}>
              <div>
                <Headline
                  size="xx-large"
                  tag="h2"
                >
                  {fullName}
                </Headline>
              </div>
            </Col>
          </Row>
          <AccordionSet>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton
                  accordionStatus={this.state.accordions}
                  id="clickable-expand-all"
                  onToggle={this.handleExpandAll}
                  setStatus={null}
                />
              </Col>
            </Row>
            <Accordion
              id="personalAccordion"
              label={<FormattedMessage id="ui-idm-connect.accordion.personal" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.personalAccordion}
            >
              <ContractPersonalView
                contract={record}
                id="contractPersonal"
                stripes={this.props.stripes}
              />
            </Accordion>
            <Accordion
              id="contractAccordion"
              label={<FormattedMessage id="ui-idm-connect.accordion.contract" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.contractAccordion}
            >
              <ContractContractView
                contract={record}
                id="contractContract"
                stripes={this.props.stripes}
              />
            </Accordion>
            <Accordion
              id="contactAccordion"
              label={<FormattedMessage id="ui-idm-connect.accordion.contact" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.contactAccordion}
            >
              <ContractContactView
                contract={record}
                id="contractContact"
                stripes={this.props.stripes}
              />
            </Accordion>
            <Accordion
              id="commentAccordion"
              label={<FormattedMessage id="ui-idm-connect.accordion.comment" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.commentAccordion}
            >
              <ContractCommentView
                contract={record}
                id="contractComment"
                stripes={this.props.stripes}
              />
            </Accordion>
          </AccordionSet>
        </Pane>
      </>
    );
  }
}


export default ContractView;
