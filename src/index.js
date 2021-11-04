import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import { Route } from '@folio/stripes/core';

import WalkInContractsRoute from './routes/WalkInContractsRoute';
import WalkInContractViewRoute from './routes/WalkInContractViewRoute';
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
        {/* <Route path={`${path}/walk-in-contracts/create`} component={WalkInContractCreateRoute} /> */}
        {/* <Route path={`${path}/walk-in-contracts/:id/edit`} component={WalkInContractEditRoute} /> */}
        <Route path={`${path}`} component={WalkInContractsRoute}>
          <Route path={`${path}/view/:id`} component={WalkInContractViewRoute} />
        </Route>
      </Switch>
    );
  }
}

export default IdmConnect;
