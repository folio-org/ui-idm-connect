import { get } from 'lodash';
import moment from 'moment';

import urls from '../components/DisplayUtils/urls';
import fetchWithDefaultOptions from './fetchWithDefaultOptions';

const fetchFolioUsers = (id, okapi) => {
  return fetchWithDefaultOptions(okapi, `/users?query=externalSystemId==${id}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(new Error('Error getting Folio users'));
      }
    });
};

const fetchIdmUsers = (formValues, okapi) => {
  return fetchWithDefaultOptions(
    okapi,
    `/idm-connect/searchidm?firstName=${formValues.firstname}` +
    `&lastName=${formValues.lastname}` +
    `&dateOfBirth=${moment(formValues.dateOfBirth).format('YYYY-MM-DD')}`
  )
    .then((response) => {
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

const handleIdmSearchClose = (history) => {
  history.push(`${urls.contracts()}`);
};

const handleIdmSearchSubmit = async ({
  values,
  stripes,
  setUsers,
  setRenderListOfResults,
  setIsUsersResultsEmpty,
  callout,
}) => {
  try {
    const result = await fetchUsers(values, stripes.okapi);

    setUsers(result);
    setRenderListOfResults(true);
    setIsUsersResultsEmpty(
      result.length === 0 || get(result[0], 'msg', '') === 'User not found'
    );
  } catch (err) {
    callout.sendCallout({ type: 'error', message: err.message });
  }
};

export {
  handleIdmSearchClose,
  handleIdmSearchSubmit,
};
