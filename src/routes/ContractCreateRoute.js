import moment from 'moment';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import {
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import ContractsForm from '../components/view/ContractsForm';

const ContractCreateRoute = ({
  history,
  location,
}) => {
  const ky = useOkapiKy();
  const CONTRACT_API = 'idm-connect/contract';

  const handleClose = () => {
    history.push({
      pathname: `${urls.searchIdm()}`,
      state: 'new',
    });
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (payload) => {
      const id = uuidv4();
      const newPayload = { ...payload, id };

      await ky.post(CONTRACT_API, { json: newPayload });
      history.push(`${urls.contractView(id)}${location.search}`);
    },
  });

  const handleSubmit = (values) => {
    return mutateAsync(values);
  };

  const adaptedInitialValues = useMemo(() => {
    const initialValues = JSON.parse(localStorage.getItem('idmConnectNewContractInitialValues')) || {};
    const searchValues = JSON.parse(localStorage.getItem('idmConnectNewContractSearchValues')) || {};

    const today = new Date();
    const todayDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    if (Object.keys(initialValues).length !== 0) {
      return {
        uniLogin: initialValues.unilogin,
        beginDate: todayDate,
        personal: {
          lastName: initialValues.surname,
          firstName: initialValues.givenname,
          dateOfBirth: moment(initialValues.dateOfBirth).format('YYYY-MM-DD'),
        },
      };
    } else {
      return {
        beginDate: todayDate,
        personal: {
          lastName: searchValues.lastname,
          firstName: searchValues.firstname,
          dateOfBirth: searchValues.dateOfBirth,
        },
      };
    }
  }, []);

  return (
    <ContractsForm
      disableLibraryCard={false}
      handlers={{ onClose: handleClose }}
      initialValues={adaptedInitialValues}
      onSubmit={handleSubmit}
    />
  );
};

ContractCreateRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default stripesConnect(ContractCreateRoute);
