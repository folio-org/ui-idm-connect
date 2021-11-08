import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import { Route } from '@folio/stripes/core';

import ContractsRoute from './routes/ContractsRoute';
import ContractViewRoute from './routes/ContractViewRoute';
import Settings from './settings';

class IdmConnect extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  };

  render() {
    const { showSettings, match: { path } } = this.props;

    if (showSettings) {
      return <Settings {...this.props} />;
    }
    return (
      <Switch>
        {/* <Route path={`${path}/walk-in-contracts/create`} component={ContractCreateRoute} /> */}
        {/* <Route path={`${path}/walk-in-contracts/:id/edit`} component={ContractEditRoute} /> */}
        <Route path={`${path}`} component={ContractsRoute}>
          <Route path={`${path}/view/:id`} component={ContractViewRoute} />
        </Route>
      </Switch>
    );
  }
}

export default IdmConnect;
