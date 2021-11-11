import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import { Field } from 'react-final-form';
import {
  Button,
  Col,
  Datepicker,
  Pane,
  PaneFooter,
  Paneset,
  Row,
  TextField,
} from '@folio/stripes/components';
import css from './SearchBtn.css';

class SearchIdm extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }),
  };

  renderPaneFooter() {
    const { handlers: { onClose } } = this.props;

    const startButton = (
      <Button
        data-test-udp-form-cancel-button
        marginBottom0
        id="clickable-close-udp-form"
        buttonStyle="default mega"
        onClick={onClose}
      >
        <FormattedMessage id="ui-erm-usage.udp.form.cancel" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} />;
  }

  render() {
    const { handleSubmit, handlers: { onClose } } = this.props;

    return (
      <form onSubmit={handleSubmit}>
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
                  validateFields={[]}
                />
              </Col>
              <Col
                xs={3}
              >
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-idm-connect.firstname" />}
                  name="firstname"
                  validateFields={[]}
                />
              </Col>
              <Col
                xs={2}
                md={1}
              >
                <Field
                  component={Datepicker}
                  label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
                  name="dateOfBirth"
                  validateFields={[]}
                />
              </Col>
              <Col
                xs={3}
              >
                <div className={css.searchButton}>
                  <Button
                    aria-label={<FormattedMessage id="ui-idm-connect.searchInputLabel" />}
                    buttonStyle="primary"
                    id="clickable-search-searchIdm"
                    marginBottom0
                    onClick={handleSubmit}
                  >
                    <FormattedMessage id="ui-idm-connect.searchInputLabel" />
                  </Button>
                </div>
              </Col>
            </Row>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesFinalForm({
  navigationCheck: true,
})(SearchIdm);
