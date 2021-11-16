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

import Required from '../../DisplayUtils/Validate';
import css from './SearchBtn.css';

class SearchIdm extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
    invalid: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.object),
  };

  renderPaneFooter() {
    const { handlers: { onClose } } = this.props;

    const startButton = (
      <Button
        data-test-udp-form-cancel-button
        marginBottom0
        id="clickable-close-form"
        buttonStyle="default mega"
        onClick={onClose}
      >
        <FormattedMessage id="ui-idm-connect.form.cancel" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} />;
  }

  columnMapping = {
    unilogin: <FormattedMessage id="ui-idm-connect.uniLogin" />,
    accountState: <FormattedMessage id="ui-idm-connect.accountState" />,
    surname: <FormattedMessage id="ui-idm-connect.lastname" />,
    givenname: <FormattedMessage id="ui-idm-connect.firstname" />,
    dateOfBirth: <FormattedMessage id="ui-idm-connect.dateOfBirth" />,
    ULAffiliation: <FormattedMessage id="ui-idm-connect.ULAffiliation" />,
  };

  getDateOfBirth = (user) => {
    if (_.get(user, 'dateOfBirth', '') !== '') {
      return moment(user.dateOfBirth).format('YYYY-MM-DD');
    } else {
      return null;
    }
  }

  resultsFormatter = {
    unilogin: users => users.unilogin,
    accountState: users => users.accountState,
    surname: users => users.surname,
    givenname: users => users.givenname,
    dateOfBirth: users => this.getDateOfBirth(users),
    ULAffiliation: users => users.ULAffiliation,
  };

  renderResults() {
    if ((this.props.users.length > 0) && (_.get(this.props.users[0], 'msg', '') === '')) {
      return (
        <Card
          id="search-idm-results-card"
          headerStart={<span>Result</span>}
          style={{ marginTop: '60px' }}
        >
          <MultiColumnList
            defaultWidth="90%"
            columnMapping={this.columnMapping}
            contentData={this.props.users}
            formatter={this.resultsFormatter}
            id="search-idm-list-users"
            visibleColumns={['unilogin', 'accountState', 'surname', 'givenname', 'dateOfBirth', 'ULAffiliation']}
          />
        </Card>
      );
    } else {
      return (
        <div
          id="search-idm-no-results"
          style={{ marginTop: '60px' }}
        >
          <span>No result</span>
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
              id="pane-search-idm-form"
              onClose={onClose}
              footer={this.renderPaneFooter()}
              paneTitle={<FormattedMessage id="ui-idm-connect.searchIdm.title" />}
              // style={{ paddingLeft: '20px', paddingRight: '20px' }}
            >
              <Row>
                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id="ui-idm-connect.lastname" />}
                    name="lastname"
                    required
                    validate={Required}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id="ui-idm-connect.firstname" />}
                    name="firstname"
                    required
                    validate={Required}
                  />
                </Col>
                <Col
                  xs={2}
                  md={1}
                >
                  <Field
                    component={Datepicker}
                    dateFormat="DDMMYYYY"
                    // backendDateStandard="DDMMYYYY"
                    // dateFormat="YYYY-MM-DD"
                    // dateFormat="DD.MM.YYYY"
                    // backendDateStandard="DDMMYYYY"
                    label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
                    name="dateOfBirth"
                    required
                    validate={Required}
                  />
                </Col>
                <Col xs={3}>
                  <div className={css.searchButton}>
                    <Button
                      aria-label={<FormattedMessage id="ui-idm-connect.searchInputLabel" />}
                      buttonStyle="primary"
                      disabled={pristine || submitting || invalid}
                      id="clickable-search-searchIdm"
                      marginBottom0
                      // onClick={onSubmit}
                      type="submit"
                    >
                      <FormattedMessage id="ui-idm-connect.searchInputLabel" />
                    </Button>
                  </div>
                </Col>
              </Row>
              <>
                {this.renderResults()}
              </>
            </Pane>
          </Paneset>
        </form>
      </>
    );
  }
}

export default stripesForm({
  form: 'myForm',
})(SearchIdm);
