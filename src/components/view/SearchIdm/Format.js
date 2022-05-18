import React from 'react';
import { FormattedMessage } from 'react-intl';

const columnWidths = {
  readerNumber: 120,
  unilogin: 150,
  surname: 200,
  givenname: 200,
  dateOfBirth: 150,
  accountState: 200,
  ULAffiliation: 120,
  cardReaderNumber: 140,
  UBReaderNumber: 140,
  UBRole: 80,
  FOLIOUser: 100,
  isChecked: 80,
};

const columnMapping = {
  readerNumber: <FormattedMessage id="ui-idm-connect.readerNumber" />,
  unilogin: <FormattedMessage id="ui-idm-connect.uniLogin" />,
  surname: <FormattedMessage id="ui-idm-connect.lastname" />,
  givenname: <FormattedMessage id="ui-idm-connect.firstname" />,
  dateOfBirth: <FormattedMessage id="ui-idm-connect.dateOfBirth" />,
  accountState: <FormattedMessage id="ui-idm-connect.accountState" />,
  ULAffiliation: <FormattedMessage id="ui-idm-connect.ULAffiliation" />,
  cardReaderNumber: <FormattedMessage id="ui-idm-connect.cardReaderNumber" />,
  UBReaderNumber: <FormattedMessage id="ui-idm-connect.UBReaderNumber" />,
  UBRole: <FormattedMessage id="ui-idm-connect.UBRole" />,
  FOLIOUser: <FormattedMessage id="ui-idm-connect.FOLIOUser" />,
  isChecked: '',
};

const basisColumns = ['readerNumber', 'unilogin', 'surname', 'givenname', 'dateOfBirth', 'accountState', 'ULAffiliation', 'cardReaderNumber', 'UBReaderNumber'];

export { basisColumns, columnMapping, columnWidths };
