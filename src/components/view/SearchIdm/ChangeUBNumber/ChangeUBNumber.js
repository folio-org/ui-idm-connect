import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import stripesForm from '@folio/stripes/form';
import {
  Button,
  Card,
  MultiColumnList,
  Pane,
  PaneFooter,
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';

import urls from '../../../DisplayUtils/urls';
import SearchFields from '../SearchFields';
import { basisColumns, columnMapping, columnWidths, basicResultsFormatter } from '../Format';
import css from '../SearchIdmStyles.css';

let newContractInitialValues = '';

const ChangeUBNumber = ({
  children,
  handlers: { onClose },
  history,
  invalid,
  isUsersResultsEmpty,
  onSubmit,
  pristine,
  renderListOfResults,
  searchValues,
  submitting,
  users,
}) => {
  const [dateOfBirth, setDateOfBirth] = useState('');

  const toggleRecord = (toggledRecord) => {
    newContractInitialValues = toggledRecord;

    localStorage.setItem('idmConnectNewContractInitialValues', JSON.stringify(newContractInitialValues));
    localStorage.setItem('idmConnectNewContractSearchValues', JSON.stringify(searchValues));
  };

  useEffect(() => {
    // result is empty, set record empty and noMatch false
    if (isUsersResultsEmpty) {
      toggleRecord('', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsersResultsEmpty]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDateOfBirth(newDate);
  };

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
          <Paneset nested isRoot>
            <Pane defaultWidth="fill">
              <Card
                id="search-idm-results-card"
                headerStart={
                  <span>
                    <FormattedMessage
                      id="ui-idm-connect.searchIdm.resultCount"
                      values={{ count }}
                    />
                  </span>
                }
              >
                <MultiColumnList
                  columnMapping={columnMapping}
                  columnWidths={columnWidths}
                  contentData={users}
                  formatter={basicResultsFormatter}
                  id="change-ubnumber-list-users"
                  interactive
                  visibleColumns={visibleColumns}
                  // for change number:
                  onRowClick={onRowClick}
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
    <>
      <Paneset>
        <Pane
          defaultWidth="100%"
          footer={renderPaneFooter()}
          id="pane-search-idm-form"
          renderHeader={renderPaneHeader}
        >
          <div className={css.addPaddingBottom}>
            <form onSubmit={(e) => onSubmit(e)}>
              <SearchFields
                dateOfBirth={dateOfBirth}
                handleDateChange={handleDateChange}
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
    </>
  );
};

ChangeUBNumber.propTypes = {
  children: PropTypes.object,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  invalid: PropTypes.bool,
  isUsersResultsEmpty: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  renderListOfResults: PropTypes.bool,
  searchValues: PropTypes.object,
  submitting: PropTypes.bool,
  users: PropTypes.arrayOf(PropTypes.object),
};

export default stripesForm({
  form: 'ChangeUBNumberForm',
})(withRouter(ChangeUBNumber));
