import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import ContractsForm from '../components/view/ContractsForm';
import urls from '../components/DisplayUtils/urls';

class ContractCreateRoute extends React.Component {
  static manifest = Object.freeze({
    contracts: {
      type: 'okapi',
      path: 'idm-connect/contract',
      fetch: false,
      shouldRefresh: () => false,
    },
  });

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      state: PropTypes.object.isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      contracts: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      contracts: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  }

  handleClose = () => {
    this.props.history.push({
      pathname: `${urls.searchIdm()}`,
      state: 'new'
    });
  }

  handleSubmit = (contract) => {
    const { history, location, mutator } = this.props;

    mutator.contracts
      .POST(contract)
      .then(({ id }) => {
        history.push(`${urls.contractView(id)}${location.search}`);
      });
  }

  getInitialValues = () => {
    // const { location } = this.props;
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
          dateOfBirth: initialValues.dateOfBirth,
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
        // personal: {
        //   lastName: location.state.lastname,
        //   firstName: location.state.firstname,
        //   dateOfBirth: location.state.dateOfBirth,
        // }
      };
    }
  }

  render() {
    // const initialValues = JSON.parse(localStorage.getItem('idmConnectNewContractInitialValues'));
    const adaptedInitialValues = this.getInitialValues();

    return (
      <ContractsForm
        handlers={{ onClose: this.handleClose }}
        initialValues={adaptedInitialValues}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(ContractCreateRoute);
