import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import stripesForm from '@folio/stripes/form';
import {
  Button,
  Card,
  MultiColumnList,
  Pane,
  PaneFooter,
  PaneHeader,
  Paneset,
} from '@folio/stripes/components';

import urls from '../../DisplayUtils/urls';
import css from './SearchIdmStyles.css';
import SearchFields from './SearchFields';
import { basisColumns, columnMapping, columnWidths, basicResultsFormatter } from './Format';

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
    ...basicResultsFormatter,
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
  }

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

  renderPaneHeader = () => {
    return (
      <PaneHeader
        dismissible
        onClose={this.props.handlers.onClose}
        paneTitle={this.props.isCreateNewUser ? <FormattedMessage id="ui-idm-connect.searchIdm.title.new.search" /> : <FormattedMessage id="ui-idm-connect.searchIdm.title" />}
      />
    );
  };

  render() {
    const {
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
              footer={this.renderPaneFooter()}
              id="pane-search-idm-form"
              renderHeader={this.renderPaneHeader}
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
