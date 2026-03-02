import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import {
  Button,
  Card,
  MultiColumnList,
  Pane,
  PaneFooter,
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import urls from '../../../DisplayUtils/urls';
import {
  basicResultsFormatter,
  basisColumns,
  columnMapping,
  columnWidths,
} from '../Format';
import SearchFields from '../SearchFields';
import css from '../SearchIdmStyles.css';

let newContractInitialValues = '';

const ChangeUBNumber = ({
  children,
  handlers: { onClose },
  history,
  invalid,
  isUsersResultsEmpty,
  handleSubmit,
  pristine,
  renderListOfResults,
  submitting,
  users,
}) => {
  const formState = useFormState();

  const toggleRecord = (toggledRecord) => {
    newContractInitialValues = toggledRecord;

    localStorage.setItem('idmConnectNewContractInitialValues', JSON.stringify(newContractInitialValues));
    localStorage.setItem('idmConnectNewContractSearchValues', JSON.stringify(formState.values));
  };

  useEffect(() => {
    // result is empty, set record empty and noMatch false
    if (isUsersResultsEmpty) {
      toggleRecord('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsersResultsEmpty]);

  const renderPaneFooter = () => {
    const startButton = (
      <Button
        buttonStyle="default mega"
        id="clickable-close-form"
        marginBottom0
        onClick={onClose}
      >
        <FormattedMessage id="ui-idm-connect.form.cancel" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} />;
  };

  const onRowClick = (_e, item) => {
    localStorage.setItem('idmConnectChangeUBNumber', JSON.stringify(item));

    history.push(urls.changeUBNumberView(item.unilogin));
  };

  const renderResults = () => {
    const count = users.length;
    const visibleColumns = [...basisColumns, 'UBRole', 'FOLIOUser'];

    if (!isUsersResultsEmpty) {
      return (
        <div style={{ height: '85%' }}>
          <Paneset isRoot nested>
            <Pane defaultWidth="fill">
              <Card
                headerStart={
                  <span>
                    <FormattedMessage
                      id="ui-idm-connect.searchIdm.resultCount"
                      values={{ count }}
                    />
                  </span>
                }
                id="search-idm-results-card"
              >
                <MultiColumnList
                  columnMapping={columnMapping}
                  columnWidths={columnWidths}
                  contentData={users}
                  formatter={basicResultsFormatter}
                  id="change-ubnumber-list-users"
                  interactive
                  onRowClick={onRowClick}
                  // for change number:
                  visibleColumns={visibleColumns}
                />
              </Card>
            </Pane>
            {children}
          </Paneset>
        </div>
      );
    } else {
      return (
        <div
          id="search-idm-no-results"
          style={{ marginTop: '60px' }}
        >
          <span>
            <FormattedMessage id="ui-idm-connect.searchIdm.noResults" />
          </span>
        </div>
      );
    }
  };

  const renderPaneHeader = () => {
    return (
      <PaneHeader
        dismissible
        onClose={onClose}
        paneTitle={<FormattedMessage id="ui-idm-connect.ubreadernumber.change" />}
      />
    );
  };

  return (
    <Paneset>
      <Pane
        defaultWidth="100%"
        footer={renderPaneFooter()}
        id="pane-search-idm-form"
        renderHeader={renderPaneHeader}
      >
        <div className={css.addPaddingBottom}>
          <form onSubmit={handleSubmit}>
            <SearchFields
              disabled={pristine || submitting || invalid}
            />
          </form>
        </div>
        <>
          {renderListOfResults &&
            renderResults()
          }
        </>
      </Pane>
    </Paneset>
  );
};

ChangeUBNumber.propTypes = {
  children: PropTypes.object,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  invalid: PropTypes.bool,
  isUsersResultsEmpty: PropTypes.bool,
  pristine: PropTypes.bool,
  renderListOfResults: PropTypes.bool,
  submitting: PropTypes.bool,
  users: PropTypes.arrayOf(PropTypes.object),
};

export default stripesFinalForm({
  subscription: {
    values: true,
    invalid: true,
    pristine: true,
    submitting: true,
  },
})(withRouter(ChangeUBNumber));
