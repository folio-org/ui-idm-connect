import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
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
    isCreateNewUser: PropTypes.bool,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    invalid: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    renderListOfResults: PropTypes.bool,
    searchString: PropTypes.string,
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

  toggleRecord = (toggledRecord, noMatch) => {
    newContractInitialValues = toggledRecord;

    localStorage.setItem('idmConnectNewContractInitialValues', JSON.stringify(newContractInitialValues));

    this.setState({
      checkedUnilogin: toggledRecord.unilogin,
      noMatchButtonSelected: noMatch,
    });
  }

  getDisableTakeContinue() {
    return this.state.checkedUnilogin === '' && !this.state.noMatchButtonSelected;
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
          onClick={this.props.isCreateNewUser ? () => this.toggleRecord({}, true) : undefined}
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
    const disableTakeContinue = this.getDisableTakeContinue();

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
        disabled={disableTakeContinue}
        id="clickable-takeContinue-form"
        marginBottom0
        to={`${urls.contractCreate()}${this.props.searchString}`}
      >
        <FormattedMessage id="ui-idm-connect.searchIdm.takeContinue" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={isCreateNewUser ? endButton : ''} />;
  }

  columnMapping = {
    unilogin: <FormattedMessage id="ui-idm-connect.uniLogin" />,
    accountState: <FormattedMessage id="ui-idm-connect.accountState" />,
    surname: <FormattedMessage id="ui-idm-connect.lastname" />,
    givenname: <FormattedMessage id="ui-idm-connect.firstname" />,
    dateOfBirth: <FormattedMessage id="ui-idm-connect.dateOfBirth" />,
    ULAffiliation: <FormattedMessage id="ui-idm-connect.ULAffiliation" />,
    UBRole: <FormattedMessage id="ui-idm-connect.UBRole" />,
    isChecked: '',
  };

  columnWidths = {
    unilogin: 150,
    accountState: 270,
    surname: 240,
    givenname: 240,
    dateOfBirth: 150,
    ULAffiliation: 150,
    UBRole: 100,
    isChecked: 100,
  };

  resultsFormatter = {
    unilogin: users => users.unilogin,
    accountState: users => users.accountState,
    surname: users => users.surname,
    givenname: users => users.givenname,
    dateOfBirth: users => moment(users.dateOfBirth).format('YYYY-MM-DD'),
    ULAffiliation: users => users.ULAffiliation,
    isChecked: users => {
      const buttonLabel = this.isButtonSelected(users) ? <FormattedMessage id="ui-idm-connect.searchIdm.selected" /> : <FormattedMessage id="ui-idm-connect.searchIdm.choose" />;
      const buttonStyle = this.isButtonSelected(users) ? 'primary' : 'default';

      return (
        <Button
          buttonStyle={buttonStyle}
          marginBottom0
          onClick={this.props.isCreateNewUser ? () => this.toggleRecord(users, false) : undefined}
        >
          {buttonLabel}
        </Button>
      );
    },
  };

  renderResults() {
    const { isCreateNewUser, users } = this.props;
    const count = users.length;
    const columns = ['unilogin', 'accountState', 'surname', 'givenname', 'dateOfBirth', 'ULAffiliation'];

    if ((count > 0) && (_.get(this.props.users[0], 'msg', '') === '')) {
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
              visibleColumns={isCreateNewUser ? [...columns, 'isChecked'] : [...columns, 'UBRole']}
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
