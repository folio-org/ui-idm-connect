import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import stripesForm from '@folio/stripes/form';
import {
  Button,
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
    givenname: <FormattedMessage id="ui-idm-connect.lastname" />,
    surname: <FormattedMessage id="ui-idm-connect.firstname" />,
    unilogin: <FormattedMessage id="ui-idm-connect.uniLogin" />,
  };

  resultsFormatter = {
    givenname: users => users.givenname,
    surname: users => users.surname,
    unilogin: users => users.unilogin,
  };

  renderResults() {
    if (this.props.users.length > 0) {
      return (
        <MultiColumnList
          autosize
          columnMapping={this.columnMapping}
          contentData={this.props.users}
          formatter={this.resultsFormatter}
          // id="list-users"
          // onHeaderClick={onSort}
          // rowFormatter={this.rowFormatter}
          // sortDirection={
          //   sortOrder.startsWith('-') ? 'descending' : 'ascending'
          // }
          // sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
          // totalCount={count}
          visibleColumns={['givenname', 'surname', 'unilogin']}
        />
      );
    } else {
      return (
        <div>nothing</div>
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
        <form onSubmit={onSubmit}>
          <Paneset>
            <Pane
              defaultWidth="fill"
              dismissible
              id="pane-search-idm-form"
              onClose={onClose}
              footer={this.renderPaneFooter()}
              paneTitle={<FormattedMessage id="ui-idm-connect.searchIdm.title" />}
            >
              <Row>
                <Col
                  xs={3}
                >
                  <Field
                    component={TextField}
                    label={<FormattedMessage id="ui-idm-connect.lastname" />}
                    name="lastname"
                    required
                    validate={Required}
                  />
                </Col>
                <Col
                  xs={3}
                >
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
                    label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
                    name="dateOfBirth"
                    required
                    validate={Required}
                  />
                </Col>
                <Col
                  xs={3}
                >
                  <div className={css.searchButton}>
                    <Button
                      aria-label={<FormattedMessage id="ui-idm-connect.searchInputLabel" />}
                      buttonStyle="primary"
                      disabled={pristine || submitting || invalid}
                      id="clickable-search-searchIdm"
                      marginBottom0
                      onClick={onSubmit}
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
  navigationCheck: true,
  enableReinitialize: true,
})(SearchIdm);
