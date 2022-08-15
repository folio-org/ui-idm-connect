import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

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
import { basisColumns, columnMapping, columnWidths, basicResultsFormatter } from '../Format';
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

  onSelectRow() {
    return '';
  }

  onRowClick(_e, item) {
    localStorage.setItem('idmConnectChangeUBNumber', JSON.stringify(item));

    this.props.history.push(urls.changeUBNumberView(item.unilogin));
  }

  renderResults() {
    const { isUsersResultsEmpty, users } = this.props;
    const count = users.length;
    const visibleColumns = [...basisColumns, 'UBRole', 'FOLIOUser'];

    if (!isUsersResultsEmpty) {
      return (
        <div style={{ height: '85%' }}>
          <Paneset nested isRoot>
            <Pane defaultWidth="fill">
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
                  formatter={basicResultsFormatter}
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
        </div>
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
              <form onSubmit={(e) => onSubmit(e)}>
                <SearchFields
                  dateOfBirth={this.state.dateOfBirth}
                  handleDateChange={this.handleDateChange}
                  disabled={pristine || submitting || invalid}
                />
              </form>
            </div>
            <>
              {this.props.renderListOfResults &&
                this.renderResults()
              }
            </>
          </Pane>
        </Paneset>
      </>
    );
  }
}

export default stripesForm({
  form: 'ChangeUBNumberForm',
})(withRouter(ChangeUBNumber));
