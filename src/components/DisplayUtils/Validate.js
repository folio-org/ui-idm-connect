import React from 'react';
import { FormattedMessage } from 'react-intl';

const Required = value => {
  if (value) return undefined;
  return <FormattedMessage id="ui-idm-connect.form.validate.required" />;
};

const RequiredMail = value => {
  const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!value || !mailRegex.test(value)) {
    return <FormattedMessage id="ui-idm-connect.form.validate.validMailRequired" />;
  }

  return undefined;
};

export { Required, RequiredMail };
