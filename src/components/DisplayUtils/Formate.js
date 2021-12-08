import React from 'react';
import moment from 'moment';

import { NoValue } from '@folio/stripes/components';

const FormatDate = (dateVal) => {
  if (dateVal === '') {
    return <NoValue />;
  } else {
    return moment(dateVal).format('YYYY-MM-DD');
  }
};

export default FormatDate;
