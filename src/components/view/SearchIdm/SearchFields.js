import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Button,
  Col,
  Datepicker,
  Row,
  TextField,
} from '@folio/stripes/components';

import { Required } from '../../DisplayUtils/Validate';
import css from './SearchIdmStyles.css';

const SearchFields = ({
  dateOfBirth,
  disabled,
  handleDateChange,
}) => {
  return (
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
      <Col md={2} xs={3}>
        <Field
          backendDateStandard="YYYY-MM-DD"
          component={Datepicker}
          id="searchIdm_dateOfBirth"
          label={<FormattedMessage id="ui-idm-connect.dateOfBirth" />}
          name="dateOfBirth"
          onChange={handleDateChange}
          required
          timeZone="UTC"
          validate={Required}
          value={dateOfBirth}
        />
      </Col>
      <Col xs={3}>
        <div className={css.searchButton}>
          <FormattedMessage id="ui-idm-connect.searchInputLabel">
            { ([ariaLabel]) => (
              <Button
                aria-label={ariaLabel}
                buttonStyle="primary"
                disabled={disabled}
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
  );
};

SearchFields.propTypes = {
  dateOfBirth: PropTypes.string,
  disabled: PropTypes.bool,
  handleDateChange: PropTypes.func,
};

export default SearchFields;
