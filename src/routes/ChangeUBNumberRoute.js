import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { getFormValues } from 'redux-form';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import ChangeUBNumber from '../components/view/SearchIdm/ChangeUBNumber/ChangeUBNumber';
import { handleIdmSearchClose, handleIdmSearchSubmit } from '../util/handler';

const ChangeUBNumberRoute = ({
  children,
  history,
  stripes,
}) => {
  const [users, setUsers] = useState([]);
  const [renderListOfResults, setRenderListOfResults] = useState(false);
  const [isUsersResultsEmpty, setIsUsersResultsEmpty] = useState(false);

  const callout = useContext(CalloutContext);
  const formValues = getFormValues('ChangeUBNumberForm')(stripes.store.getState()) || {};

  return (
    <ChangeUBNumber
      handlers={{ onClose: () => handleIdmSearchClose(history) }}
      isUsersResultsEmpty={isUsersResultsEmpty}
      onSubmit={(e) => handleIdmSearchSubmit({
        event: e,
        form: 'ChangeUBNumberForm',
        stripes,
        setUsers,
        setRenderListOfResults,
        setIsUsersResultsEmpty,
        callout,
      })}
      renderListOfResults={renderListOfResults}
      searchValues={formValues}
      users={users}
    >
      {children}
    </ChangeUBNumber>
  );
};

ChangeUBNumberRoute.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
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

export default stripesConnect(ChangeUBNumberRoute);
