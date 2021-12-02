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
  // Checkbox,
  Col,
  Datepicker,
  MultiColumnList,
  Pane,
  PaneFooter,
  Paneset,
  // RadioButton,
  Row,
  TextField,
} from '@folio/stripes/components';

import Required from '../../DisplayUtils/Validate';
import urls from '../../DisplayUtils/urls';
import css from './SearchBtn.css';

let newContractInitialValues = '';

class SearchIdm extends React.Component {
  static propTypes = {
    createNewUser: PropTypes.bool,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    invalid: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    readyToRender: PropTypes.bool,
    searchString: PropTypes.string,
    submitting: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);

    // this.toggleRecord = this.toggleRecord.bind(this);
    this.state = {
      dateOfBirth: '',
      // selected: false,
      checkedUnilogin: '',
    };
  }

  toggleRecord = toggledRecord => {
    newContractInitialValues = toggledRecord;
    // this.setState(prevState => ({
    //   selected: !prevState.selected,
    // }));

    localStorage.setItem('idmConnectNewContractInitialValues', JSON.stringify(newContractInitialValues));

    this.setState({
      checkedUnilogin: toggledRecord.unilogin,
      // userButtonState: this.props.users.map(user => (
      //   (user.unilogin === toggledRecord.unilogin) ?
      //     {
      //       id: user.unilogin,
      //       value: true,
      //     } : {
      //       id: user.unilogin,
      //       value: false,
      //     })),
    });
  }

  getDisableTakeContinue() {
    if (newContractInitialValues === '') {
      return true;
    } else {
      return false;
    }
  }

  renderPaneFooter() {
    const { createNewUser, handlers: { onClose } } = this.props;
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
        // TODO: adapt disabled; not working when closing and search again
        disabled={disableTakeContinue}
        id="clickable-takeContinue-form"
        marginBottom0
        to={`${urls.contractCreate()}${this.props.searchString}`}
      >
        <FormattedMessage id="ui-idm-connect.searchIdm.takeContinue" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={createNewUser ? endButton : ''} />;
  }

  renderNoMatchButton() {
    return (
      <Button
        buttonStyle="default"
        onClick={this.props.createNewUser ? () => this.toggleRecord({}) : undefined}
      >
        <FormattedMessage id="ui-idm-connect.searchIdm.noMatch" />
      </Button>
    );
  }

  columnMapping = {
    unilogin: <FormattedMessage id="ui-idm-connect.uniLogin" />,
    accountState: <FormattedMessage id="ui-idm-connect.accountState" />,
    surname: <FormattedMessage id="ui-idm-connect.lastname" />,
    givenname: <FormattedMessage id="ui-idm-connect.firstname" />,
    dateOfBirth: <FormattedMessage id="ui-idm-connect.dateOfBirth" />,
    ULAffiliation: <FormattedMessage id="ui-idm-connect.ULAffiliation" />,
    isChecked: '',
  };

  isButtonSelected = (user) => {
    return user.unilogin === this.state.checkedUnilogin;
  }

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
          onClick={this.props.createNewUser ? () => this.toggleRecord(users) : undefined}
        >
          {buttonLabel}
        </Button>
      );
    },

    // isChecked: users => (
    //   <Button
    //     buttonStyle="default"
    //     marginBottom0
    //     onClick={this.props.createNewUser ? () => this.toggleRecord(users) : undefined}
    //   >
    //     {this.state.selected ? <FormattedMessage id="ui-idm-connect.searchIdm.selected" /> : <FormattedMessage id="ui-idm-connect.searchIdm.choose" />}
    //   </Button>
    // ),
  };

  renderResults() {
    const { createNewUser, users } = this.props;
    const count = users.length;

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
              contentData={this.props.users}
              formatter={this.resultsFormatter}
              id="search-idm-list-users"
              interactive={false}
              visibleColumns={createNewUser ? ['unilogin', 'accountState', 'surname', 'givenname', 'dateOfBirth', 'ULAffiliation', 'isChecked'] : ['unilogin', 'accountState', 'surname', 'givenname', 'dateOfBirth', 'ULAffiliation']}
            />
          </Card>
          {createNewUser ? this.renderNoMatchButton() : '' }
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

  handleDateChange = (e) => {
    const newDate = e.target.value;
    this.setState({
      dateOfBirth: newDate,
    });
  };

  render() {
    const {
      handlers: { onClose },
      invalid,
      onSubmit,
      pristine,
      submitting,
    } = this.props;

    // console.log('result state.userButtonState:');
    // console.log(this.state.userButtonState);

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
                {this.props.readyToRender &&
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
