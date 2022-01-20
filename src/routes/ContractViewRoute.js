import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import ContractView from '../components/view/ContractView';

class ContractViewRoute extends React.Component {
  static manifest = Object.freeze({
    source: {
      type: 'okapi',
      path: 'idm-connect/contract/:{id}',
      // throwErrors: false,
      // fetch: false,
      shouldRefresh: () => false,
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
    mutator: PropTypes.shape({
      source: PropTypes.shape({
        // PUT: PropTypes.func.isRequired,
        DELETE: PropTypes.func.isRequired,
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
    this.props.history.push(`${urls.contracts()}${location.search}`);
  }

  handleEdit = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.contractEdit(match.params.id)}${location.search}`);
  }

  handleDelete = (contract) => {
    const { history, location, mutator } = this.props;

    mutator.source.DELETE({ contract }).then(() => {
      history.push(`${urls.contracts()}${location.search}`);
    });
    // this.props.history.push(`${urls.contractDelete(match.params.id)}${location.search}`);
  }

  render() {
    const { stripes } = this.props;

    return (
      <ContractView
        canEdit={stripes.hasPerm('ui-idm-connect.create-edit')}
        handlers={{
          onClose: this.handleClose,
          onEdit: this.handleEdit,
          onDelete: this.handleDelete,
        }}
        isLoading={_.get(this.props.resources, 'source.isPending', true)}
        record={_.get(this.props.resources, 'source.records', []).find(i => i.id === this.props.match.params.id)}
        stripes={this.props.stripes}
      />
    );
  }
}

export default stripesConnect(ContractViewRoute);
