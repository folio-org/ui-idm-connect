import moment from 'moment';
import { FormattedMessage } from 'react-intl';

const getInitialValues = () => {
  const initialValues = JSON.parse(localStorage.getItem('idmConnectChangeUBNumber'));

  if (initialValues) {
    return {
      personal: {
        lastName: initialValues.surname,
        firstName: initialValues.givenname,
        dateOfBirth: moment(initialValues.dateOfBirth).format('YYYY-MM-DD'),
      },
      status: initialValues.accountState,
      ULAffiliation: initialValues.ULAffiliation,
      UBRole: initialValues.UBRole
        ? <FormattedMessage id="ui-idm-connect.yes" />
        : <FormattedMessage id="ui-idm-connect.no" />,
      uniLogin: initialValues.unilogin,
      UBReaderNumber: initialValues.UBReaderNumber,
      cardReaderNumber: initialValues.cardReaderNumber,
    };
  } else {
    return null;
  }
};

export default getInitialValues;
