import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const fetchFolioUser = (id, okapi) => {
  return fetch(`${okapi.url}/users?query=externalSystemId==${id}`, {
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      this.sendCallout('error', <FormattedMessage id="ui-idm-connect.FOLIOUser" />);
      return Promise.reject(response);
    }
  }).catch((err) => {
    this.sendCallout('error', err.statusText);
    return Promise.reject(err);
  });
};

const fetchIdmUser = (formValues, okapi) => {
  return fetch(`${okapi.url}/idm-connect/searchidm?firstName=${formValues.firstname}&lastName=${formValues.lastname}&dateOfBirth=${moment(formValues.dateOfBirth).format('YYYY-MM-DD')}`, {
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      this.sendCallout('error', '');
      return Promise.reject(response);
    }
  }).catch((err) => {
    this.sendCallout('error', err.statusText);
    return Promise.reject(err);
  });
};

const mergeData = (idmUser, folioUsers) => {
  idmUser.folioUsers = folioUsers;
  return idmUser;
}

export { fetchFolioUser, fetchIdmUser, mergeData };
