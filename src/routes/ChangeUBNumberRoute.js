import PropTypes from 'prop-types';
import {
  useContext,
  useState,
} from 'react';

import {
  CalloutContext,
  stripesConnect,
} from '@folio/stripes/core';

import ChangeUBNumber from '../components/view/SearchIdm/ChangeUBNumber/ChangeUBNumber';
import {
  handleIdmSearchClose,
  handleIdmSearchSubmit,
} from '../util/handler';

const ChangeUBNumberRoute = ({
  children,
  history,
  stripes,
}) => {
  const [users, setUsers] = useState([]);
  const [renderListOfResults, setRenderListOfResults] = useState(false);
  const [isUsersResultsEmpty, setIsUsersResultsEmpty] = useState(false);

  const callout = useContext(CalloutContext);

  const handleSubmit = async (values) => {
    await handleIdmSearchSubmit({
      values,
      stripes,
      setUsers,
      setRenderListOfResults,
      setIsUsersResultsEmpty,
      callout,
    });
  };

  return (
    <ChangeUBNumber
      handlers={{ onClose: () => handleIdmSearchClose(history) }}
      isUsersResultsEmpty={isUsersResultsEmpty}
      onSubmit={handleSubmit}
      renderListOfResults={renderListOfResults}
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
  }).isRequired,
};

export default stripesConnect(ChangeUBNumberRoute);
