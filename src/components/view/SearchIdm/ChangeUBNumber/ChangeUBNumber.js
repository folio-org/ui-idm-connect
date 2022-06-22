import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
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

import urls from '../../../DisplayUtils/urls';
import SearchFields from '../SearchFields';
import { basisColumns, columnMapping, columnWidths } from '../Format';
import css from '../SearchIdmStyles.css';

let newContractInitialValues = '';

class ChangeUBNumber extends React.Component {
  static propTypes = {
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

  constructor(props) {
    super(props);

    this.onRowClick = this.onRowClick.bind(this);
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

  onRowClick(e, item) {
    localStorage.setItem('idmConnectChangeUBNumber', JSON.stringify(item));

    this.props.history.push(urls.changeUBNumberView(item.unilogin));
  }

  renderResults() {
    const { isUsersResultsEmpty, users } = this.props;
    const count = users.length;
    const visibleColumns = [...basisColumns, 'UBRole', 'FOLIOUser'];

    if (!isUsersResultsEmpty) {
      return (
        <Paneset nested static>
          <Pane
            height="80%"
            // defaultWidth="50%"
          >
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
                contentData={this.props.users}
                formatter={this.resultsFormatter}
                id="change-ubnumber-list-users"
                interactive
                visibleColumns={visibleColumns}
                // for change number:
                onRowClick={this.onRowClick}
              />
            </Card>
          </Pane>
          {this.props.children}
        </Paneset>
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
              <div className={css.addPaddingBottom}>
                <SearchFields
                  dateOfBirth={this.state.dateOfBirth}
                  handleDateChange={this.handleDateChange}
                  disabled={pristine || submitting || invalid}
                />
              </div>
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
})(withRouter(ChangeUBNumber));
