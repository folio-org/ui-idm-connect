import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Route } from '@folio/stripes/core';

import ChangeUBNumberRoute from './routes/ChangeUBNumberRoute';
import ChangeUBNumberViewRoute from './routes/ChangeUBNumberViewRoute';
import ContractCreateRoute from './routes/ContractCreateRoute';
import ContractEditRoute from './routes/ContractEditRoute';
import ContractsRoute from './routes/ContractsRoute';
import ContractViewRoute from './routes/ContractViewRoute';
import SearchIdmRoute from './routes/SearchIdmRoute';
import Settings from './settings';

const IdmConnect = ({
  location,
  match,
  showSettings,
  stripes,
}) => {
  if (showSettings) {
    return (
      <Settings
        location={location}
        match={match}
        stripes={stripes}
      />
    );
  }

  return (
    <Switch>
      {/* <Route path={`${path}/change-ubnumber/view/:unilogin`} component={ChangeUBNumberViewRoute} />
      <Route path={`${path}/change-ubnumber`} component={ChangeUBNumberRoute} /> */}
      <Route component={ChangeUBNumberRoute} path={`${match.path}/change-ubnumber/:unilogin?`}>
        <Route component={ChangeUBNumberViewRoute} path={`${match.path}/change-ubnumber/view/:unilogin`} />
      </Route>
      <Route component={SearchIdmRoute} path={`${match.path}/search-idm`} />
      <Route component={ContractCreateRoute} path={`${match.path}/create`} />
      <Route component={ContractEditRoute} path={`${match.path}/:id/edit`} />
      <Route component={ContractsRoute} path={`${match.path}/:id?`}>
        <Route component={ContractViewRoute} path={`${match.path}/view/:id`} />
      </Route>
    </Switch>
  );
};

IdmConnect.propTypes = {
  location: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  showSettings: PropTypes.bool,
  stripes: PropTypes.object.isRequired,
};

export default IdmConnect;
