import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';
import moment from 'moment';

import stripesForm from '@folio/stripes/form';
import {
  Button,
  Card,
  MultiColumnList,
  Pane,
  PaneFooter,
  Paneset,
} from '@folio/stripes/components';

import urls from '../../DisplayUtils/urls';
import css from './SearchIdmStyles.css';
import SearchFields from './SearchFields';
import { basisColumns, columnMapping, columnWidths } from './Format';

let newContractInitialValues = '';

class SearchIdm extends React.Component {
  static propTypes = {
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

  constructor(props) {
    super(props);

    this.state = {
      dateOfBirth: '',
      checkedUnilogin: '',
      noMatchButtonSelected: false,
    };
  }

  componentDidUpdate(prevProps) {
    // result is empty, set record empty and noMatch false
    if (this.props.isUsersResultsEmpty && this.props.isUsersResultsEmpty !== prevProps.isUsersResultsEmpty) {
      this.toggleRecord('', false);
    }
  }

  toggleRecord(toggledRecord, noMatch) {
    const unilogin = _.get(toggledRecord, 'unilogin', '');
    newContractInitialValues = toggledRecord;

    localStorage.setItem('idmConnectNewContractInitialValues', JSON.stringify(newContractInitialValues));
    localStorage.setItem('idmConnectNewContractSearchValues', JSON.stringify(this.props.searchValues));

    this.setState({
      noMatchButtonSelected: noMatch,
      checkedUnilogin: unilogin,
    });
  }

  getDisableTakeContinue() {
    return !(this.props.isUsersResultsEmpty || this.state.noMatchButtonSelected || this.state.checkedUnilogin !== '');
  }

  getLabelForContiunueButton = () => {
    if (this.state.checkedUnilogin === '') {
      return <FormattedMessage id="ui-idm-connect.searchIdm.continue" />;
    } else {
      return <FormattedMessage id="ui-idm-connect.searchIdm.takeContinue" />;
    }
  }

  isButtonSelected = (user) => {
    return user.unilogin === this.state.checkedUnilogin;
  }

  renderNoMatchButton() {
    const buttonStyle = this.state.noMatchButtonSelected ? 'primary' : 'default';

    return (
      <div className={css.noMatchButton}>
        <Button
          buttonStyle={buttonStyle}
          onClick={() => this.toggleRecord('', true)}
        >
          <FormattedMessage id="ui-idm-connect.searchIdm.noMatch" />
        </Button>
      </div>
    );
  }

  handleDateChange = (e) => {
    const newDate = e.target.value;
    this.setState({
      dateOfBirth: newDate,
    });
  };

  renderPaneFooter() {
    const { isCreateNewUser, handlers: { onClose } } = this.props;

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
        disabled={this.getDisableTakeContinue()}
        id="clickable-takeContinue-form"
        marginBottom0
        to={`${urls.contractCreate()}`}
      >
        {this.getLabelForContiunueButton()}
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={isCreateNewUser ? endButton : ''} />;
  }

  resultsFormatter = {
    readerNumber: users => users.readerNumber,
    unilogin: users => users.unilogin,
    surname: users => users.surname,
    givenname: users => users.givenname,
    dateOfBirth: users => <FormattedDate value={moment(users.dateOfBirth).format('YYYY-MM-DD')} timeZone="UTC" />,
    accountState: users => users.accountState,
    ULAffiliation: users => users.ULAffiliation,
    cardReaderNumber: users => users.cardReaderNumber,
    UBReaderNumber: users => users.UBReaderNumber,
    UBRole: users => users.UBRole,
    FOLIOUser: users => {
      let folioUser = '';
      if (users.folioUsers) {
        if (users.folioUsers.totalRecords === 1) {
          const folioUserName = `${users.folioUsers.users[0].personal.lastName}, ${users.folioUsers.users[0].personal.firstName}`;
          const folioUserId = users.folioUsers.users[0].id;
          folioUser = <Link to={{ pathname: `${urls.userView(folioUserId)}` }} target="_blank">{folioUserName}</Link>;
        } else if (users.folioUsers.totalRecords > 1) {
          folioUser = <><FormattedMessage id="ui-idm-connect.warning" />:&nbsp;<Link to={{ pathname: `${urls.userSearch(users.unilogin)}` }} target="_blank"><FormattedMessage id="ui-idm-connect.searchIdm.multipleFolioUser" /></Link></>;
        } else {
          folioUser = <FormattedMessage id="ui-idm-connect.searchIdm.noFolioUser" />;
        }
      }
      return folioUser;
    },
    isChecked: users => {
      const buttonLabel = this.isButtonSelected(users) ? <FormattedMessage id="ui-idm-connect.searchIdm.selected" /> : <FormattedMessage id="ui-idm-connect.searchIdm.choose" />;
      const buttonStyle = this.isButtonSelected(users) ? 'primary' : 'default';

      return (
        <Button
          buttonStyle={buttonStyle}
          marginBottom0
          onClick={() => this.toggleRecord(users, false)}
        >
          {buttonLabel}
        </Button>
      );
    },
  };

  renderResults() {
    const { isCreateNewUser, isUsersResultsEmpty, users } = this.props;
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
              contentData={this.props.users}
              formatter={this.resultsFormatter}
              id="search-idm-list-users"
              interactive={false}
              visibleColumns={isCreateNewUser ? [...basisColumns, 'isChecked'] : [...basisColumns, 'UBRole', 'FOLIOUser']}
            />
          </Card>
          {isCreateNewUser ? this.renderNoMatchButton() : '' }
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
  }

  render() {
    const {
      handlers: { onClose },
      invalid,
      onSubmit,
      pristine,
      submitting,
    } = this.props;

    return (
      <>
        <form onSubmit={(e) => onSubmit(e)}>
          <Paneset>
            <Pane
              defaultWidth="100%"
              dismissible
              footer={this.renderPaneFooter()}
              id="pane-search-idm-form"
              onClose={onClose}
              paneTitle={<FormattedMessage id="ui-idm-connect.searchIdm.title" />}
            >
              <SearchFields
                dateOfBirth={this.state.dateOfBirth}
                handleDateChange={this.handleDateChange}
                disabled={pristine || submitting || invalid}
              />
              <>
                {this.props.renderListOfResults &&
                  this.renderResults()
                }
              </>
            </Pane>
          </Paneset>
        </form>
      </>
    );
  }
}

export default stripesForm({
  form: 'SearchIdmForm',
})(SearchIdm);
