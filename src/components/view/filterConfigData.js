import React from 'react';
import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    label: 'Status',
    name: 'status',
    cql: 'status',
    values: [
      { name: <FormattedMessage id="ui-idm-connect.dataOption.active" />, cql: 'active' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.notTransmitted" />, cql: 'notTransmitted' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.inProgress" />, cql: 'inProgress' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.conflictCases" />, cql: 'conflictCases' },
    ],
  }
];

export default filterConfig;
