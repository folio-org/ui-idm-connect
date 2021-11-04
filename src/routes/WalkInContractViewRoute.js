import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import WalkInContractView from '../components/view/WalkInContractView';

class WalkInContractViewRoute extends React.Component {
  static manifest = Object.freeze({
    source: {
      type: 'okapi',
      path: 'idm-connect/contract/:{id}',
    },
    query: {},
  });

  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      source: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  };

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.walkInContracts()}${location.search}`);
  }

  // handleEdit = () => {
  //   const { location, match } = this.props;
  //   this.props.history.push(`${urls.sourceEdit(match.params.id)}${location.search}`);
  // }

  render() {
    // const { stripes } = this.props;

    return (
      <WalkInContractView
        // canEdit={stripes.hasPerm('ui-idm-connect.item.put')}
        handlers={{
          onClose: this.handleClose,
          onEdit: this.handleEdit,
        }}
        isLoading={_.get(this.props.resources, 'source.isPending', true)}
        record={_.get(this.props.resources, 'source.records', []).find(i => i.id === this.props.match.params.id)}
        stripes={this.props.stripes}
      />
    );
  }
}

export default stripesConnect(WalkInContractViewRoute);
