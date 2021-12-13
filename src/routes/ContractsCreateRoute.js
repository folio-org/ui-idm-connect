import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import ContractsForm from '../components/view/ContractsForm';
import urls from '../components/DisplayUtils/urls';

class ContractsCreateRoute extends React.Component {
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

  checkInitialValues = (initialValues) => {
    if (initialValues.length === 0) {
      const today = new Date();
      const todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const adaptedInitialValues = {
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
      return adaptedInitialValues;
    } else {
      return {};
    }
  }

  render() {
    const initialValues = JSON.parse(localStorage.getItem('idmConnectNewContractInitialValues'));
    const adaptedInitialValues = this.checkInitialValues(initialValues);

    return (
      <ContractsForm
        handlers={{ onClose: this.handleClose }}
        initialValues={adaptedInitialValues}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(ContractsCreateRoute);
