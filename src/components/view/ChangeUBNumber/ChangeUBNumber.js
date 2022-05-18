import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';
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

class ChangeUBNumber extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    invalid: PropTypes.bool,
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
    };
  }

  componentDidUpdate(prevProps) {
    // result is empty, set record empty and noMatch false
    if (this.props.isUsersResultsEmpty && this.props.isUsersResultsEmpty !== prevProps.isUsersResultsEmpty) {
      this.toggleRecord('', false);
    }
  }

  toggleRecord(toggledRecord) {
    newContractInitialValues = toggledRecord;

    localStorage.setItem('idmConnectNewContractInitialValues', JSON.stringify(newContractInitialValues));
    localStorage.setItem('idmConnectNewContractSearchValues', JSON.stringify(this.props.searchValues));
  }

  handleDateChange = (e) => {
    const newDate = e.target.value;
    this.setState({
      dateOfBirth: newDate,
    });
  };

  renderPaneFooter() {
    const { handlers: { onClose } } = this.props;

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
  }

  columnMapping = {
    readerNumber: <FormattedMessage id="ui-idm-connect.readerNumber" />,
    unilogin: <FormattedMessage id="ui-idm-connect.uniLogin" />,
    surname: <FormattedMessage id="ui-idm-connect.lastname" />,
    givenname: <FormattedMessage id="ui-idm-connect.firstname" />,
    dateOfBirth: <FormattedMessage id="ui-idm-connect.dateOfBirth" />,
    accountState: <FormattedMessage id="ui-idm-connect.accountState" />,
    ULAffiliation: <FormattedMessage id="ui-idm-connect.ULAffiliation" />,
    cardReaderNumber: <FormattedMessage id="ui-idm-connect.cardReaderNumber" />,
    UBReaderNumber: <FormattedMessage id="ui-idm-connect.UBReaderNumber" />,
    UBRole: <FormattedMessage id="ui-idm-connect.UBRole" />,
    FOLIOUser: <FormattedMessage id="ui-idm-connect.FOLIOUser" />,
  };

  columnWidths = {
    readerNumber: 120,
    unilogin: 150,
    surname: 200,
    givenname: 200,
    dateOfBirth: 150,
    accountState: 200,
    ULAffiliation: 120,
    cardReaderNumber: 140,
    UBReaderNumber: 140,
    UBRole: 80,
    FOLIOUser: 100,
  };

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
  };

  onSelectRow() {
    return '';
  }

  renderResults() {
    const { isUsersResultsEmpty, users } = this.props;
    const count = users.length;
    const visibleColumns = ['readerNumber', 'unilogin', 'surname', 'givenname', 'dateOfBirth', 'accountState', 'ULAffiliation', 'cardReaderNumber', 'UBReaderNumber', 'UBRole', 'FOLIOUser'];

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
              id="change-ubnumber-list-users"
              interactive
              visibleColumns={visibleColumns}
              // for change number:
              onRowClick={this.onSelectRow}
            />
          </Card>
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
              paneTitle={<FormattedMessage id="ui-idm-connect.ubreadernumber.change" />}
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
                    backendDateStandard="YYYY-MM-DD"
                    component={Datepicker}
                    id="searchIdm_dateOfBirth"
                    label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
                    name="dateOfBirth"
                    onChange={this.handleDateChange}
                    required
                    timeZone="UTC"
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
  form: 'ChangeUBNumberForm',
})(ChangeUBNumber);
