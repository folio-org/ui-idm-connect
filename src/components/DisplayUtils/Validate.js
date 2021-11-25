import React from 'react';
import { FormattedMessage } from 'react-intl';

const Required = value => {
  if (value) return undefined;
  return <FormattedMessage id="ui-idm-connect.form.validate.required" />;
};

export default Required;
