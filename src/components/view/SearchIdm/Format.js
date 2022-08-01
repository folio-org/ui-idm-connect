import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedDate } from 'react-intl';
import moment from 'moment';

import urls from '../../DisplayUtils/urls';

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

const basicResultsFormatter = {
  readerNumber: users => users.readerNumber,
  unilogin: users => users.unilogin,
  surname: users => users.surname,
  givenname: users => users.givenname,
  dateOfBirth: users => <FormattedDate value={moment(users.dateOfBirth).format('YYYY-MM-DD')} timeZone="UTC" />,
  accountState: users => users.accountState,
  ULAffiliation: users => users.ULAffiliation,
  cardReaderNumber: users => users.cardReaderNumber,
  UBReaderNumber: users => users.UBReaderNumber,
  UBRole: users => (users.UBRole ? '✓' : '-'),
  FOLIOUser: users => {
    let folioUser = '';
    if (users.folioUsers) {
      if (users.folioUsers.totalRecords === 1) {
        const folioUserName = `${users.folioUsers.users[0].personal.lastName}, ${users.folioUsers.users[0].personal.firstName}`;
        const folioUserId = users.folioUsers.users[0].id;
        folioUser = <Link to={{ pathname: `${urls.userView(folioUserId)}` }} target="_blank">{folioUserName}</Link>;
      } else if (users.folioUsers.totalRecords > 1) {
        folioUser = <><FormattedMessage id="ui-idm-connect.warning" />:&nbsp;<Link to={{ pathname: `${urls.userSearch(users.unilogin)}` }} target="_blank"><FormattedMessage id="ui-idm-connect.searchIdm.multipleFolioUser" /></Link></>;
      } else {
        folioUser = <FormattedMessage id="ui-idm-connect.searchIdm.noFolioUser" />;
      }
    }
    return folioUser;
  },
};

const basisColumns = ['readerNumber', 'unilogin', 'surname', 'givenname', 'dateOfBirth', 'accountState', 'ULAffiliation', 'cardReaderNumber', 'UBReaderNumber'];

export { basisColumns, columnMapping, columnWidths, basicResultsFormatter };
