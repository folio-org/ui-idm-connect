import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';

import { stripesConnect, useOkapiKy } from '@folio/stripes/core';
import { Loading } from '@folio/stripes/components';

import ContractsForm from '../components/view/ContractsForm';
import urls from '../components/DisplayUtils/urls';

const ContractEditRoute = ({
  history,
  location,
  match,
}) => {
  const ky = useOkapiKy();
  const CONTRACT_API = `idm-connect/contract/${match.params.id}`;

  const { data: contract = {}, isLoading: isContractLoading } = useQuery(
    [CONTRACT_API, 'getContract'],
    () => ky.get(CONTRACT_API).json()
  );

  const getInitialValues = () => {
    const initialValues = cloneDeep(contract);

    return initialValues;
  };

  const handleClose = () => {
    history.push(`${urls.contractView(match.params.id)}${location.search}`);
  };

  const { mutateAsync: putContract } = useMutation(
    [CONTRACT_API, 'putContract'],
    (payload) => ky.put(CONTRACT_API, { json: payload })
      .then(() => {
        handleClose();
      })
  );

  const handleSubmit = (values) => {
    return putContract(values);
  };

  if (isContractLoading) return <Loading />;

  return (
    <ContractsForm
      handlers={{ onClose: handleClose }}
      initialValues={getInitialValues()}
      onSubmit={handleSubmit}
      disableLibraryCard
      isEditContract
    />
  );
};

ContractEditRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default stripesConnect(ContractEditRoute);
