import PropTypes from 'prop-types';
import {
  useContext,
  useState,
} from 'react';
import { getFormValues } from 'redux-form';

import {
  CalloutContext,
  stripesConnect,
} from '@folio/stripes/core';

import SearchIdm from '../components/view/SearchIdm/SearchIdm';
import {
  handleIdmSearchClose,
  handleIdmSearchSubmit,
} from '../util/handler';

const SearchIdmRoute = ({
  history,
  location,
  stripes,
}) => {
  const [users, setUsers] = useState([]);
  const [renderListOfResults, setRenderListOfResults] = useState(false);
  const [isUsersResultsEmpty, setIsUsersResultsEmpty] = useState(false);

  const callout = useContext(CalloutContext);

  const isCreateNewUser = location.state === 'new';
  const formValues = getFormValues('SearchIdmForm')(stripes.store.getState()) || {};

  return (
    <SearchIdm
      handlers={{ onClose: () => handleIdmSearchClose(history) }}
      isCreateNewUser={isCreateNewUser}
      isUsersResultsEmpty={isUsersResultsEmpty}
      onSubmit={(e) => handleIdmSearchSubmit({
        event: e,
        form: 'SearchIdmForm',
        stripes,
        setUsers,
        setRenderListOfResults,
        setIsUsersResultsEmpty,
        callout,
      })}
      renderListOfResults={renderListOfResults}
      searchValues={formValues}
      users={users}
    />
  );
};

SearchIdmRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.string.isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      url: PropTypes.string,
    }),
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

export default stripesConnect(SearchIdmRoute);
