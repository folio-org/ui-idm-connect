import PropTypes from 'prop-types';
import moment from 'moment';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import {
  useOkapiKy,
  stripesConnect,
} from '@folio/stripes/core';

import ContractsForm from '../components/view/ContractsForm';
import urls from '../components/DisplayUtils/urls';

const ContractCreateRoute = ({
  history,
  location,
  // stripes,
}) => {
  const ky = useOkapiKy();
  // const stripes = useStripes();
  // const hasPerms = stripes.hasPerm('finc-config.metadata-collections.item.post');
  const CONTRACT_API = 'idm-connect/contract';

  const handleClose = () => {
    history.push({
      pathname: `${urls.searchIdm()}`,
      state: 'new'
    });
  };

  const { mutateAsync: handleSubmit } = useMutation({
    mutationFn: (payload) => {
      const id = uuidv4();
      const newPayload = { ...payload, id };

      ky.post(CONTRACT_API, { json: newPayload })
        .then(() => {
          history.push(`${urls.contractView(id)}${location.search}`);
        });
    },
  });

  // if (!hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

  const getInitialValues = () => {
    const initialValues = JSON.parse(localStorage.getItem('idmConnectNewContractInitialValues'));
    const searchValues = JSON.parse(localStorage.getItem('idmConnectNewContractSearchValues'));

    const today = new Date();
    const todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    if (initialValues.length !== 0) {
      return {
        uniLogin: initialValues.unilogin,
        // TODO: status
        // status: initialValues.accountState,
        beginDate: todayDate,
        personal: {
          lastName: initialValues.surname,
          firstName: initialValues.givenname,
          dateOfBirth: moment(initialValues.dateOfBirth).format('YYYY-MM-DD'),
        }
      };
    } else {
      return {
        beginDate: todayDate,
        personal: {
          lastName: searchValues.lastname,
          firstName: searchValues.firstname,
          dateOfBirth: searchValues.dateOfBirth,
        }
      };
    }
  };

  const adaptedInitialValues = getInitialValues();

  return (
    <ContractsForm
      handlers={{ onClose: handleClose }}
      initialValues={adaptedInitialValues}
      onSubmit={handleSubmit}
      disableLibraryCard={false}
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
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default stripesConnect(ContractCreateRoute);
