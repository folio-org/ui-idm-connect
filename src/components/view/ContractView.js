import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useState } from 'react';
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

const ContractView = ({
  canEdit,
  canDelete,
  handlers,
  isLoading,
  record,
  stripes,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [accordions, setAccordions] = useState(
    {
      personalAccordion: false,
      contractAccordion: false,
      contactAccordion: false,
      commentAccordion: false,
    }
  );

  const handleExpandAll = (obj) => {
    setAccordions(obj);
  };

  const handleAccordionToggle = ({ id }) => {
    setAccordions({ ...accordions, [id]: !accordions[id] });
  };

  const renderLoadingPanePaneHeader = () => {
    return (
      <PaneHeader
        dismissible
        onClose={handlers.onClose}
        paneTitle={<span>loading</span>}
      />
    );
  };

  const beginDelete = () => {
    setConfirmDelete(true);
  };

  const doConfirmDelete = (confirmation) => {
    if (confirmation) {
      handlers.onDelete();
    } else {
      setConfirmDelete(false);
    }
  };

  // eslint-disable-next-line react/prop-types
  const getActionMenu = () => ({ onToggle }) => {
    const fullName = `${get(record, 'personal.lastName')}, ${get(record, 'personal.firstName')}`;
    const isStatusDraft = get(record, 'status') === 'draft';

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
                    beginDelete();
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
            onCancel={() => { doConfirmDelete(false); }}
            onConfirm={() => { doConfirmDelete(true); }}
            open={confirmDelete}
          />
        </>
      );
    } else {
      return null;
    }
  };

  const renderDetailsPanePaneHeader = () => {
    const fullName = `${get(record, 'personal.lastName')}, ${get(record, 'personal.firstName')}`;

    return (
      <PaneHeader
        actionMenu={getActionMenu()}
        dismissible
        onClose={handlers.onClose}
        paneTitle={<span>{fullName}</span>}
      />
    );
  };

  const renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-contractDetails"
        renderHeader={renderLoadingPanePaneHeader}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  };

  const fullName = `${get(record, 'personal.lastName')}, ${get(record, 'personal.firstName')}`;

  if (isLoading) return renderLoadingPane();

  return (
    <>
      <Pane
        defaultWidth="40%"
        id="pane-contractDetails"
        renderHeader={renderDetailsPanePaneHeader}
      >
        <ContractHeaderView
          contract={record}
          id="contractHeader"
          stripes={stripes}
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
                accordionStatus={accordions}
                id="clickable-expand-all"
                onToggle={handleExpandAll}
                setStatus={null}
              />
            </Col>
          </Row>
          <Accordion
            id="personalAccordion"
            label={<FormattedMessage id="ui-idm-connect.accordion.personal" />}
            onToggle={handleAccordionToggle}
            open={accordions.personalAccordion}
          >
            <ContractPersonalView
              contract={record}
              id="contractPersonal"
              stripes={stripes}
            />
          </Accordion>
          <Accordion
            id="contractAccordion"
            label={<FormattedMessage id="ui-idm-connect.accordion.contract" />}
            onToggle={handleAccordionToggle}
            open={accordions.contractAccordion}
          >
            <ContractContractView
              contract={record}
              id="contractContract"
              stripes={stripes}
            />
          </Accordion>
          <Accordion
            id="contactAccordion"
            label={<FormattedMessage id="ui-idm-connect.accordion.contact" />}
            onToggle={handleAccordionToggle}
            open={accordions.contactAccordion}
          >
            <ContractContactView
              contract={record}
              id="contractContact"
              stripes={stripes}
            />
          </Accordion>
          <Accordion
            id="commentAccordion"
            label={<FormattedMessage id="ui-idm-connect.accordion.comment" />}
            onToggle={handleAccordionToggle}
            open={accordions.commentAccordion}
          >
            <ContractCommentView
              contract={record}
              id="contractComment"
              stripes={stripes}
            />
          </Accordion>
        </AccordionSet>
      </Pane>
    </>
  );
};

ContractView.propTypes = {
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


export default ContractView;
