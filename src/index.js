import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import { Route } from '@folio/stripes/core';

import ContractsRoute from './routes/ContractsRoute';
import ContractViewRoute from './routes/ContractViewRoute';
import ContractCreateRoute from './routes/ContractCreateRoute';
import ContractEditRoute from './routes/ContractEditRoute';
import SearchIdmRoute from './routes/SearchIdmRoute';
import ChangeUBNumberRoute from './routes/ChangeUBNumberRoute';
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
        <Route path={`${path}/change-ubnumber`} component={ChangeUBNumberRoute} />
        <Route path={`${path}/search-idm`} component={SearchIdmRoute} />
        <Route path={`${path}/create`} component={ContractCreateRoute} />
        <Route path={`${path}/:id/edit`} component={ContractEditRoute} />
        <Route path={`${path}`} component={ContractsRoute}>
          <Route path={`${path}/view/:id`} component={ContractViewRoute} />
        </Route>
      </Switch>
    );
  }
}

export default IdmConnect;
