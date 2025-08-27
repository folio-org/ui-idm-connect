import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import ContractView from '../components/view/ContractView';

const ContractViewRoute = ({
  history,
  location,
  match: { params: { id: contractId } },
  stripes,
}) => {
  const CONTRACT_API = 'idm-connect/contract';
  const ky = useOkapiKy();

  const useContract = () => {
    const { isLoading, data: contract = {} } = useQuery(
      [CONTRACT_API, contractId],
      () => ky.get(`${CONTRACT_API}/${contractId}`).json(),
      // The query will not execute until the id exists
      { enabled: Boolean(contractId) },
    );

    return ({
      isLoading,
      contract,
    });
  };

  const { contract, isLoading: isContractLoading } = useContract();

  const handleClose = () => {
    history.push(`${urls.contracts()}${location.search}`);
  };

  const handleEdit = () => {
    history.push(`${urls.contractEdit(contractId)}${location.search}`);
  };

  const { mutateAsync: deleteContact } = useMutation(
    [CONTRACT_API, 'deleteContact'],
    () => ky.delete(CONTRACT_API)
      .then(() => {
        history.push(`${urls.contracts()}${location.search}`);
      })
  );

  return (
    <ContractView
      canEdit={stripes.hasPerm('ui-idm-connect.edit-delete')}
      canDelete={stripes.hasPerm('ui-idm-connect.edit-delete')}
      handlers={{
        onClose: handleClose,
        onEdit: handleEdit,
        onDelete: deleteContact,
      }}
      isLoading={isContractLoading}
      record={contract}
      stripes={stripes}
    />
  );
};

ContractViewRoute.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    source: PropTypes.shape({
      DELETE: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    source: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
    okapi: PropTypes.object.isRequired,
  }).isRequired,
};

export default stripesConnect(ContractViewRoute);
