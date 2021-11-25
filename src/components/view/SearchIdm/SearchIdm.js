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
  Checkbox,
  Col,
  Datepicker,
  MultiColumnList,
  Pane,
  PaneFooter,
  Paneset,
  Row,
  TextField,
} from '@folio/stripes/components';

import Required from '../../DisplayUtils/Validate';
import css from './SearchBtn.css';

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
    submitting: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);

    this.state = {
      dateOfBirth: '',
      checkedMap: {},
    };
  }

  toggleRecord = toggledRecord => {
    const { unilogin } = toggledRecord;

    this.setState((state) => {
      // const { contentData } = props;
      const wasChecked = Boolean(state.checkedMap[unilogin]);
      const checkedMap = { ...state.checkedMap };

      if (wasChecked) {
        delete checkedMap[unilogin];
      } else {
        checkedMap[unilogin] = toggledRecord;
      }

      return {
        checkedMap,
      };
    });
  }

  renderPaneFooter() {
    const { createNewUser, handlers: { onClose } } = this.props;

    const startButton = (
      <Button
        marginBottom0
        id="clickable-close-form"
        buttonStyle="default mega"
        onClick={onClose}
      >
        <FormattedMessage id="ui-idm-connect.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        marginBottom0
        id="clickable-takeContinue-form"
        buttonStyle="default mega"
        onClick={onClose}
      >
        <FormattedMessage id="ui-idm-connect.searchIdm.takeContinue" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={createNewUser ? endButton : ''} />;
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

  resultsFormatter = {
    unilogin: users => users.unilogin,
    accountState: users => users.accountState,
    surname: users => users.surname,
    givenname: users => users.givenname,
    dateOfBirth: users => moment(users.dateOfBirth).format('YYYY-MM-DD'),
    ULAffiliation: users => users.ULAffiliation,
    isChecked: users => (
      <Checkbox
        checked={Boolean(this.state.checkedMap[users.unilogin])}
        onChange={this.props.createNewUser ? () => this.toggleRecord(users) : undefined}
        type="checkbox"
      />
    ),
  };

  renderResults() {
    const { createNewUser, users } = this.props;
    const count = users.length;

    if ((count > 0) && (_.get(this.props.users[0], 'msg', '') === '')) {
      return (
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
