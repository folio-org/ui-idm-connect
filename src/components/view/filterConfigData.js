import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    label: 'Status',
    name: 'status',
    cql: 'status',
    values: [
      { name: <FormattedMessage id="ui-idm-connect.dataOption.activated" />, cql: 'activated' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.created" />, cql: 'created' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.pending" />, cql: 'pending' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.conflict" />, cql: 'conflict' },
    ],
  }
];

export default filterConfig;
