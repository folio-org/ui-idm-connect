import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import { Route } from '@folio/stripes/core';

import WalkInContractsRoute from './routes/WalkInContractsRoute';
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
        {/* <Route path={`${path}/metadata-sources/create`} component={SourceCreateRoute} /> */}
        {/* <Route path={`${path}/metadata-sources/:id/edit`} component={SourceEditRoute} /> */}
        <Route path={`${path}`} component={WalkInContractsRoute}>
          {/* <Route path={`${path}/metadata-sources/:id`} component={WalkInContractsRoute} /> */}
        </Route>
      </Switch>
    );
  }
}

export default IdmConnect;
