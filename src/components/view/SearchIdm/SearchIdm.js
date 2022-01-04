import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import moment from 'moment';

import stripesForm from '@folio/stripes/form';
import {
  Button,
  Card,
  Col,
  Datepicker,
  MultiColumnList,
  Pane,
  PaneFooter,
  Paneset,
  Row,
  TextField,
} from '@folio/stripes/components';

import { Required } from '../../DisplayUtils/Validate';
import urls from '../../DisplayUtils/urls';
import css from './SearchIdmStyles.css';

let newContractInitialValues = '';

class SearchIdm extends React.Component {
  static propTypes = {
    // folioUserId: PropTypes.string,
    // folioUserNotAvailable: PropTypes.bool,
    // multipleFolioUserWithId: PropTypes.string,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    invalid: PropTypes.bool,
    isCreateNewUser: PropTypes.bool,
    isUsersResultsEmpty: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    renderListOfResults: PropTypes.bool,
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

  columnMapping = {
    surname: <FormattedMessage id="ui-idm-connect.lastname" />,
    givenname: <FormattedMessage id="ui-idm-connect.firstname" />,
    dateOfBirth: <FormattedMessage id="ui-idm-connect.dateOfBirth" />,
    unilogin: <FormattedMessage id="ui-idm-connect.uniLogin" />,
    accountState: <FormattedMessage id="ui-idm-connect.accountState" />,
    ULAffiliation: <FormattedMessage id="ui-idm-connect.ULAffiliation" />,
    UBRole: <FormattedMessage id="ui-idm-connect.UBRole" />,
    FOLIOUser: <FormattedMessage id="ui-idm-connect.FOLIOUser" />,
    isChecked: '',
  };

  columnWidths = {
    surname: 240,
    givenname: 240,
    dateOfBirth: 150,
    unilogin: 150,
    accountState: 270,
    ULAffiliation: 150,
    UBRole: 100,
    FOLIOUser: 100,
    isChecked: 100,
  };

  resultsFormatter = {
    surname: users => users.surname,
    givenname: users => users.givenname,
    dateOfBirth: users => moment(users.dateOfBirth).format('YYYY-MM-DD'),
    unilogin: users => users.unilogin,
    accountState: users => users.accountState,
    ULAffiliation: users => users.ULAffiliation,
    UBRole: users => users.UBRole,
    FOLIOUser: users => {
      let folioUser = '';
      if (users.folioUserId) {
        folioUser = <Link to={{ pathname: `${urls.userView(users.folioUserId)}` }}>{users.folioUserName}</Link>;
      } else if (users.multipleFolioUserWithId) {
        folioUser = <><FormattedMessage id="ui-idm-connect.warning" />:&nbsp;<Link to={{ pathname: `${urls.userSearch(users.multipleFolioUserWithId)}` }}><FormattedMessage id="ui-idm-connect.searchIdm.multipleFolioUser" /></Link></>;
      } else {
        folioUser = <FormattedMessage id="ui-idm-connect.searchIdm.noFolioUser" />;
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
    const columns = ['surname', 'givenname', 'dateOfBirth', 'unilogin', 'accountState', 'ULAffiliation'];

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
              columnMapping={this.columnMapping}
              columnWidths={this.columnWidths}
              contentData={this.props.users}
              formatter={this.resultsFormatter}
              id="search-idm-list-users"
              interactive={false}
              visibleColumns={isCreateNewUser ? [...columns, 'isChecked'] : [...columns, 'UBRole', 'FOLIOUser']}
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
              <Row>
                <Col xs={3}>
                  <Field
                    component={TextField}
                    id="searchIdm_lastname"
                    label={<FormattedMessage id="ui-idm-connect.lastname" />}
                    name="lastname"
                    required
                    validate={Required}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    component={TextField}
                    id="searchIdm_firstname"
                    label={<FormattedMessage id="ui-idm-connect.firstname" />}
                    name="firstname"
                    required
                    validate={Required}
                  />
                </Col>
                <Col xs={3} md={2}>
                  <Field
                    backendDateStandard="YYYYMMDD"
                    component={Datepicker}
                    dateFormat="YYYY-MM-DD"
                    id="searchIdm_dateOfBirth"
                    label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
                    name="dateOfBirth"
                    onChange={this.handleDateChange}
                    required
                    validate={Required}
                    value={this.state.dateOfBirth}
                  />
                </Col>
                <Col xs={3}>
                  <div className={css.searchButton}>
                    <FormattedMessage id="ui-idm-connect.searchInputLabel">
                      { ([ariaLabel]) => (
                        <Button
                          aria-label={ariaLabel}
                          buttonStyle="primary"
                          disabled={pristine || submitting || invalid}
                          id="clickable-search-searchIdm"
                          marginBottom0
                          type="submit"
                        >
                          <FormattedMessage id="ui-idm-connect.searchInputLabel" />
                        </Button>
                      )}
                    </FormattedMessage>
                  </div>
                </Col>
              </Row>
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
