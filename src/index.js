import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import { Route } from '@folio/stripes/core';

import WalkInContractsRoute from './routes/WalkInContractsRoute';
import WalkInContractViewRoute from './routes/WalkInContractViewRoute';
import SearchIdmRoute from './routes/SearchIdmRoute';
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
        <Route path={`${path}/search-idm`} component={SearchIdmRoute} />
        <Route path={`${path}`} component={WalkInContractsRoute}>
          <Route path={`${path}/walk-in-contracts/:id`} component={WalkInContractViewRoute} />
        </Route>
        {/* <Route
          path={`${path}/search-idm`}
          render={(
            <SearchIdmRoute {...this.props} />
          )}
        /> */}
      </Switch>
    );
  }
}

export default IdmConnect;
