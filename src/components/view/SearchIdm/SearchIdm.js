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
    };
  }

  renderPaneFooter() {
    const { handlers: { onClose } } = this.props;

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
    const count = this.props.users.length;
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
