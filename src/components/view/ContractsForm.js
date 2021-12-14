import React from 'react';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import ContractPersonalForm from './ContractPersonal/ContractPersonalForm';
import ContractContractForm from './ContractContract/ContractContractForm';
import ContractContactForm from './ContractContact/ContractContactForm';
import ContractCommentForm from './ContractComment/ContractCommentForm';

class ContractsForm extends React.Component {
  static propTypes = {
    handlers: PropTypes.PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    invalid: PropTypes.bool,
    isLoading: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };

  static defaultProps = {
    initialValues: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      accordions: {
        editPersonalAccordion: true,
        editContractAccordion: true,
        editContactAccordion: true,
        editCommentAccordion: true,
      },
    };

    this.handleExpandAll = this.handleExpandAll.bind(this);
  }

  getFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-idm-connect.form.close">
          { ([ariaLabel]) => (
            <IconButton
              ariaLabel={ariaLabel}
              icon="times"
              id="clickable-closecontractdialog"
              onClick={this.props.handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  getPaneFooter() {
    const {
      handlers: { onClose },
      handleSubmit,
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
        buttonStyle="default mega"
        data-test-contract-form-cancel-button
        id="clickable-close-contract-form"
        marginBottom0
        onClick={onClose}
      >
        <FormattedMessage id="ui-idm-connect.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        data-test-contract-form-submit-button
        disabled={disabled}
        id="clickable-savecontract"
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="ui-idm-connect.form.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
  }

  handleExpandAll(accordions) {
    this.setState({ accordions });
  }

  handleSectionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = cloneDeep(state);

      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  render() {
    const { initialValues, isLoading, handleSubmit } = this.props;
    const { accordions } = this.state;
    const paneTitle = initialValues.uniLogin ? `${initialValues.personal.lastName}, ${initialValues.personal.firstName}` : <FormattedMessage id="ui-idm-connect.form.create" />;
    const uniLoginIsSet = !!initialValues.uniLogin;
    const firstMenu = this.getFirstMenu();
    const footer = this.getPaneFooter();

    if (isLoading) return <Icon icon="spinner-ellipsis" width="10px" />;

    return (
      <form
        data-test-contract-form-page
        id="form-contract"
        onSubmit={handleSubmit}
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            firstMenu={firstMenu}
            footer={footer}
            paneTitle={paneTitle}
          >
            <div>
              <AccordionSet>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton
                      accordionStatus={accordions}
                      id="clickable-expand-all"
                      onToggle={this.handleExpandAll}
                      setStatus={null}
                    />
                  </Col>
                </Row>
                <ContractPersonalForm
                  accordionId="editPersonalAccordion"
                  expanded={accordions.editPersonalAccordion}
                  onToggle={this.handleSectionToggle}
                />
                <ContractContractForm
                  accordionId="editContractAccordion"
                  expanded={accordions.editContractAccordion}
                  onToggle={this.handleSectionToggle}
                  uniLoginIsSet={uniLoginIsSet}
                />
                <ContractContactForm
                  accordionId="editContactAccordion"
                  expanded={accordions.editContactAccordion}
                  onToggle={this.handleSectionToggle}
                />
                <ContractCommentForm
                  accordionId="editCommentAccordion"
                  expanded={accordions.editCommentAccordion}
                  onToggle={this.handleSectionToggle}
                />
              </AccordionSet>
            </div>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesFinalForm({
  // the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
  // set navigationCheck true for confirming changes
  navigationCheck: true,
  subscription: {
    values: true,
    invalid: true,
  },
})(ContractsForm);
