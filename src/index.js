import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Route } from '@folio/stripes/core';

import ContractsRoute from './routes/ContractsRoute';
import ContractViewRoute from './routes/ContractViewRoute';
import ContractCreateRoute from './routes/ContractCreateRoute';
import ContractEditRoute from './routes/ContractEditRoute';
import SearchIdmRoute from './routes/SearchIdmRoute';
import ChangeUBNumberRoute from './routes/ChangeUBNumberRoute';
import ChangeUBNumberViewRoute from './routes/ChangeUBNumberViewRoute';
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
      <Route path={`${match.path}/change-ubnumber/:unilogin?`} component={ChangeUBNumberRoute}>
        <Route path={`${match.path}/change-ubnumber/view/:unilogin`} component={ChangeUBNumberViewRoute} />
      </Route>
      <Route path={`${match.path}/search-idm`} component={SearchIdmRoute} />
      <Route path={`${match.path}/create`} component={ContractCreateRoute} />
      <Route path={`${match.path}/:id/edit`} component={ContractEditRoute} />
      <Route path={`${match.path}/:id?`} component={ContractsRoute}>
        <Route path={`${match.path}/view/:id`} component={ContractViewRoute} />
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
