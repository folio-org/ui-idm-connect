import PropTypes from 'prop-types';
import { useState } from 'react';
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
  PaneHeader,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import ContractPersonalForm from './ContractPersonal/ContractPersonalForm';
import ContractContractForm from './ContractContract/ContractContractForm';
import ContractContactForm from './ContractContact/ContractContactForm';
import ContractCommentForm from './ContractComment/ContractCommentForm';

const ContractsForm = ({
  disableLibraryCard,
  handlers: { onClose },
  handleSubmit,
  initialValues = {},
  invalid,
  isEditContract,
  isLoading,
  pristine,
  submitting,
}) => {
  const [accordions, setAccordions] = useState({
    editPersonalAccordion: true,
    editContractAccordion: true,
    editContactAccordion: true,
    editCommentAccordion: true,
  });

  const getFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-idm-connect.form.close">
          { ([ariaLabel]) => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="clickable-closecontractdialog"
              onClick={onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const getPaneFooter = () => {
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
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
  };

  const handleExpandAll = (a) => {
    setAccordions(a);
  };

  const handleSectionToggle = ({ id }) => {
    setAccordions((prevSections) => ({ ...prevSections, [id]: !prevSections[id] }));
  };

  const renderPaneHeader = () => {
    const paneTitleEdit = initialValues.uniLogin ? `${initialValues.personal.lastName}, ${initialValues.personal.firstName}` : <FormattedMessage id="ui-idm-connect.edit" />;
    const paneTitleCreate = <FormattedMessage id="ui-idm-connect.searchIdm.title.new.create" />;
    const firstMenu = getFirstMenu();

    return (
      <PaneHeader
        firstMenu={firstMenu}
        paneTitle={isEditContract ? paneTitleEdit : paneTitleCreate}
      />
    );
  };

  const footer = getPaneFooter();

  if (isLoading) return <Icon icon="spinner-ellipsis" width="10px" />;

  return (
    <form
      id="form-contract"
      onSubmit={handleSubmit}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          footer={footer}
          renderHeader={renderPaneHeader}
        >
          <div>
            <AccordionSet>
              <Row end="xs">
                <Col xs>
                  <ExpandAllButton
                    accordionStatus={accordions}
                    id="clickable-expand-all"
                    onToggle={handleExpandAll}
                    setStatus={null}
                  />
                </Col>
              </Row>
              <ContractPersonalForm
                accordionId="editPersonalAccordion"
                expanded={accordions.editPersonalAccordion}
                onToggle={handleSectionToggle}
              />
              <ContractContractForm
                accordionId="editContractAccordion"
                expanded={accordions.editContractAccordion}
                onToggle={handleSectionToggle}
                disableLibraryCard={disableLibraryCard}
              />
              <ContractContactForm
                accordionId="editContactAccordion"
                expanded={accordions.editContactAccordion}
                onToggle={handleSectionToggle}
              />
              <ContractCommentForm
                accordionId="editCommentAccordion"
                expanded={accordions.editCommentAccordion}
                onToggle={handleSectionToggle}
              />
            </AccordionSet>
          </div>
        </Pane>
      </Paneset>
    </form>
  );
};

ContractsForm.propTypes = {
  disableLibraryCard: PropTypes.bool,
  handlers: PropTypes.PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  invalid: PropTypes.bool,
  isEditContract: PropTypes.bool,
  isLoading: PropTypes.bool,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};

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
