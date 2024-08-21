import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
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

import urls from '../../DisplayUtils/urls';
import css from './SearchIdmStyles.css';
import SearchFields from './SearchFields';
import { basisColumns, columnMapping, columnWidths, basicResultsFormatter } from './Format';

let newContractInitialValues = '';

const SearchIdm = ({
  handlers: { onClose },
  invalid,
  isCreateNewUser,
  isUsersResultsEmpty,
  onSubmit,
  pristine,
  renderListOfResults,
  searchValues,
  submitting,
  users,
}) => {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [checkedUnilogin, setCheckedUnilogin] = useState('');
  const [noMatchButtonSelected, setNoMatchButtonSelected] = useState(false);

  const toggleRecord = (toggledRecord, noMatch) => {
    const unilogin = get(toggledRecord, 'unilogin', '');
    newContractInitialValues = toggledRecord;

    localStorage.setItem('idmConnectNewContractInitialValues', JSON.stringify(newContractInitialValues));
    localStorage.setItem('idmConnectNewContractSearchValues', JSON.stringify(searchValues));

    setNoMatchButtonSelected(noMatch);
    setCheckedUnilogin(unilogin);
  };

  useEffect(() => {
    // result is empty, set record empty and noMatch false
    if (isUsersResultsEmpty) {
      toggleRecord('', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsersResultsEmpty]);

  const getDisableTakeContinue = () => {
    return !(isUsersResultsEmpty || noMatchButtonSelected || checkedUnilogin !== '');
  };

  const getLabelForContiunueButton = () => {
    if (checkedUnilogin === '') {
      return <FormattedMessage id="ui-idm-connect.searchIdm.continue" />;
    } else {
      return <FormattedMessage id="ui-idm-connect.searchIdm.takeContinue" />;
    }
  };

  const isButtonSelected = (user) => {
    return user.unilogin === checkedUnilogin;
  };

  const renderNoMatchButton = () => {
    const buttonStyle = noMatchButtonSelected ? 'primary' : 'default';

    return (
      <div className={css.noMatchButton}>
        <Button
          buttonStyle={buttonStyle}
          onClick={() => toggleRecord('', true)}
        >
          <FormattedMessage id="ui-idm-connect.searchIdm.noMatch" />
        </Button>
      </div>
    );
  };

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

    const endButton = (
      <Button
        buttonStyle="default mega"
        disabled={getDisableTakeContinue()}
        id="clickable-takeContinue-form"
        marginBottom0
        to={`${urls.contractCreate()}`}
      >
        {getLabelForContiunueButton()}
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={isCreateNewUser ? endButton : ''} />;
  };

  const resultsFormatter = {
    ...basicResultsFormatter,
    isChecked: user => {
      const buttonLabel = isButtonSelected(user) ? <FormattedMessage id="ui-idm-connect.searchIdm.selected" /> : <FormattedMessage id="ui-idm-connect.searchIdm.choose" />;
      const buttonStyle = isButtonSelected(user) ? 'primary' : 'default';

      return (
        <Button
          buttonStyle={buttonStyle}
          marginBottom0
          onClick={() => toggleRecord(user, false)}
        >
          {buttonLabel}
        </Button>
      );
    },
  };

  const renderResults = () => {
    const count = users.length;

    if (!isUsersResultsEmpty) {
      return (
        <>
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
            style={{ marginTop: '60px' }}
          >
            <MultiColumnList
              columnMapping={columnMapping}
              columnWidths={columnWidths}
              contentData={users}
              formatter={resultsFormatter}
              id="search-idm-list-users"
              interactive={false}
              visibleColumns={isCreateNewUser ? [...basisColumns, 'isChecked'] : [...basisColumns, 'UBRole', 'FOLIOUser']}
            />
          </Card>
          {isCreateNewUser ? renderNoMatchButton() : '' }
        </>
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
        paneTitle={isCreateNewUser ? <FormattedMessage id="ui-idm-connect.searchIdm.title.new.search" /> : <FormattedMessage id="ui-idm-connect.searchIdm.title" />}
      />
    );
  };

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)}>
        <Paneset>
          <Pane
            defaultWidth="100%"
            footer={renderPaneFooter()}
            id="pane-search-idm-form"
            renderHeader={renderPaneHeader}
          >
            <SearchFields
              dateOfBirth={dateOfBirth}
              handleDateChange={handleDateChange}
              disabled={pristine || submitting || invalid}
            />
            <>
              {renderListOfResults &&
                renderResults()
              }
            </>
          </Pane>
        </Paneset>
      </form>
    </>
  );
};

SearchIdm.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  invalid: PropTypes.bool,
  isCreateNewUser: PropTypes.bool,
  isUsersResultsEmpty: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  renderListOfResults: PropTypes.bool,
  searchValues: PropTypes.object,
  submitting: PropTypes.bool,
  users: PropTypes.arrayOf(PropTypes.object),
};

export default stripesForm({
  form: 'SearchIdmForm',
})(SearchIdm);
