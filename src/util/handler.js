import moment from 'moment';

const fetchFolioUser = (id, okapi, callout) => {
  return fetch(`${okapi.url}/users?query=externalSystemId==${id}`, {
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      callout.sendCallout({
        message: `Error: ${response.statusText}`,
        type: 'error',
      });
      return Promise.reject(response);
    }
  }).catch((err) => {
    callout.sendCallout({
      message: 'Error',
      type: 'error',
    });
    return Promise.reject(err);
  });
};

const fetchIdmUser = (formValues, okapi) => {
  return fetch(`${okapi.url}/idm-connect/searchidm?firstName=${formValues.firstname}&lastName=${formValues.lastname}&dateOfBirth=${moment(formValues.dateOfBirth).format('YYYY-MM-DD')}`, {
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
    },
  });
};

const mergeData = (idmUser, folioUsers) => {
  idmUser.folioUsers = folioUsers;
  return idmUser;
};

export { fetchFolioUser, fetchIdmUser, mergeData };
