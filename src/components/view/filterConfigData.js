import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    label: 'Status',
    name: 'status',
    cql: 'status',
    values: [
      { name: <FormattedMessage id="ui-idm-connect.dataOption.updated" />, cql: 'updated' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.draft" />, cql: 'draft' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.pending" />, cql: 'pending' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.pending_edit" />, cql: 'pending_edit' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.transmission_error" />, cql: 'transmission_error' },
      { name: <FormattedMessage id="ui-idm-connect.dataOption.transmission_error_edit" />, cql: 'transmission_error_edit' },
    ],
  },
];

export default filterConfig;
