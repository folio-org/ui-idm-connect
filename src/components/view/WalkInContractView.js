import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Headline,
  Icon,
  Layout,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import WalkInContractHeaderView from './WalkInContractHeader/WalkInContractHeaderView';
import WalkInContractPersonalView from './WalkInContractPersonal/WalkInContractPersonalView';
import WalkInContractContractView from './WalkInContractContract/WalkInContractContractView';
import WalkInContractContactView from './WalkInContractContact/WalkInContractContactView';
import WalkInContractCommentView from './WalkInContractComment/WalkInContractCommentView';

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

    this.state = {
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
    const fullName = `${_.get(record, 'personal.lastName')}, ${_.get(record, 'personal.firstName')}`;

    if (isLoading) return this.renderLoadingPane();

    return (
      <>
        <Pane
          defaultWidth="40%"
          dismissible
          id="pane-walkInContractDetails"
          lastMenu={this.renderEditPaneMenu()}
          onClose={this.props.handlers.onClose}
          paneTitle={<span>{fullName}</span>}
        >
          <WalkInContractHeaderView
            id="walkInContractHeader"
            walkInContract={record}
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
              <WalkInContractPersonalView
                id="walkInContractPersonal"
                walkInContract={record}
                stripes={this.props.stripes}
              />
            </Accordion>
            <Accordion
              id="contractAccordion"
              label={<FormattedMessage id="ui-idm-connect.accordion.contract" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.contractAccordion}
            >
              <WalkInContractContractView
                id="walkInContractContract"
                walkInContract={record}
                stripes={this.props.stripes}
              />
            </Accordion>
            <Accordion
              id="contactAccordion"
              label={<FormattedMessage id="ui-idm-connect.accordion.contact" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.contactAccordion}
            >
              <WalkInContractContactView
                id="walkInContractContact"
                walkInContract={record}
                stripes={this.props.stripes}
              />
            </Accordion>
            <Accordion
              id="commentAccordion"
              label={<FormattedMessage id="ui-idm-connect.accordion.comment" />}
              onToggle={this.handleAccordionToggle}
              open={this.state.accordions.commentAccordion}
            >
              <WalkInContractCommentView
                id="walkInContractComment"
                walkInContract={record}
                stripes={this.props.stripes}
              />
            </Accordion>
          </AccordionSet>
        </Pane>
      </>
    );
  }
}


export default WalkInContractView;
