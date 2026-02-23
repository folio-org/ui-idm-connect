import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormState } from 'react-final-form';

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

import urls from '../../DisplayUtils/urls';
import {
  basicResultsFormatter,
  basisColumns,
  columnMapping,
  columnWidths,
} from './Format';
import SearchFields from './SearchFields';
import css from './SearchIdmStyles.css';

let newContractInitialValues = '';

const SearchIdm = ({
  handlers: { onClose },
  invalid,
  isCreateNewUser,
  isUsersResultsEmpty,
  handleSubmit,
  pristine,
  renderListOfResults,
  submitting,
  users,
}) => {
  const [checkedUnilogin, setCheckedUnilogin] = useState('');
  const [noMatchButtonSelected, setNoMatchButtonSelected] = useState(false);

  const formState = useFormState();

  const toggleRecord = (toggledRecord, noMatch) => {
    const unilogin = get(toggledRecord, 'unilogin', '');
    newContractInitialValues = toggledRecord;

    localStorage.setItem('idmConnectNewContractInitialValues', JSON.stringify(newContractInitialValues));
    localStorage.setItem('idmConnectNewContractSearchValues', JSON.stringify(formState.values));

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

    return <PaneFooter renderEnd={isCreateNewUser ? endButton : ''} renderStart={startButton} />;
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
            headerStart={
              <span>
                <FormattedMessage
                  id="ui-idm-connect.searchIdm.resultCount"
                  values={{ count }}
                />
              </span>
            }
            id="search-idm-results-card"
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
    <form onSubmit={handleSubmit}>
      <Paneset>
        <Pane
          defaultWidth="100%"
          footer={renderPaneFooter()}
          id="pane-search-idm-form"
          renderHeader={renderPaneHeader}
        >
          <SearchFields
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
  );
};

SearchIdm.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  invalid: PropTypes.bool,
  isCreateNewUser: PropTypes.bool,
  isUsersResultsEmpty: PropTypes.bool,
  handleSubmit: PropTypes.func,
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
})(SearchIdm);
