import React from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import { NoValue } from '@folio/stripes/components';

const FormatDate = (dateVal) => {
  if (dateVal === '') {
    return <NoValue />;
  } else {
    return moment(dateVal).format('YYYY-MM-DD');
  }
};

const DataLable = (field) => {
  if (field !== '') {
    return <FormattedMessage id={`ui-idm-connect.dataOption.${field}`} />;
  } else {
    return <NoValue />;
  }
};

export { FormatDate, DataLable };
