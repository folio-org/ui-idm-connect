import React from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import ContractsForm from '../components/view/ContractsForm';
import urls from '../components/DisplayUtils/urls';

class ContractsRoute extends React.Component {
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

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     hasPerms: props.stripes.hasPerm('idm-connect.contract.item.post'),
  //   };
  // }

  handleClose = () => {
    // const { location } = this.props;

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

  render() {
    // if (!this.state.hasPerms) return <div><FormattedMessage id="ui-idm-connect.noPermission" /></div>;

    return (
      <ContractsForm
        handlers={{ onClose: this.handleClose }}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(ContractsRoute);
