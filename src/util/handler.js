import moment from 'moment';
import { getFormValues } from 'redux-form';
import _ from 'lodash';
import urls from '../components/DisplayUtils/urls';

const createOkapiHeaders = (okapi) => {
  return {
    headers: {
      'X-Okapi-Tenant': okapi.tenant,
      'X-Okapi-Token': okapi.token,
    },
  };
};

const fetchFolioUsers = (id, okapi) => {
  return fetch(
    `${okapi.url}/users?query=externalSystemId==${id}`,
    createOkapiHeaders(okapi)
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(new Error('Error getting Folio users'));
    }
  });
};

const fetchIdmUsers = (formValues, okapi) => {
  return fetch(
    `${okapi.url}/idm-connect/searchidm?firstName=${formValues.firstname}&lastName=${formValues.lastname}&dateOfBirth=${moment(formValues.dateOfBirth).format('YYYY-MM-DD')}`,
    createOkapiHeaders(okapi)
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(new Error('Error getting IDM users'));
    }
  });
};

const mergeData = (idmUser, folioUsers) => {
  idmUser.folioUsers = folioUsers;
  return idmUser;
};

const fetchUsers = (formValues, okapi) => {
  return fetchIdmUsers(formValues, okapi)
    .then((idmusers) => idmusers
      .filter((idmuser) => idmuser.unilogin)
      .map((idmuser) => fetchFolioUsers(idmuser.unilogin, okapi).then((foliouser) => mergeData(idmuser, foliouser))))
    .then((promises) => Promise.all(promises));
};

const handleIdmSearchClose = (context) => {
  context.props.history.push(`${urls.contracts()}`);
};

const handleIdmSearchSubmit = (context, form, e) => {
  e.preventDefault();
  const formValues =
    getFormValues(form)(context.props.stripes.store.getState()) || {};

  fetchUsers(formValues, context.props.stripes.okapi)
    .then((result) => {
      context.setState(() => ({
        users: result,
        renderListOfResults: true,
        isUsersResultsEmpty: result.length === 0 || _.get(result[0], 'msg', '') === 'User not found',
      }));
    })
    .catch((err) => {
      context.context.sendCallout({ type: 'error', message: err.message });
    });
};

export { handleIdmSearchClose, handleIdmSearchSubmit };
