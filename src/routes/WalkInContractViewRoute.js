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
      // type: 'okapi',
      type: 'rest',
      root: 'http://localhost:8080/idm-connect/walk-in-contracts/',
      records: 'walkInContracts',
      // query: '',
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
    const record = {
      'id' : '7650c947-535c-43c7-97c8-4d3ad2aa7bd9',
      'personal' : {
        'firstName' : 'Heinz',
        'lastName' : 'Wäscher',
        'academicTitle' : 'Prof.',
        'dateOfBirth' : '1968-04-01',
        'address' : {
          'addressLine1' : 'Sonnenallee 42',
          'addressLine2' : 'Hinterhaus',
          'zipCode' : '12045',
          'city' : 'Berlin',
          'country' : 'Germany'
        },
        'email' : 'heinz.waescher@yahoo.com'
      },
      'libraryCard' : '12345678',
      'uniLogin' : 'wae01mai',
      'status' : 'active',
      'beginDate' : '2001-10-01',
      'endDate' : '2022-09-31',
      'comment' : 'A comment.'
    };

    return (
      <WalkInContractView
        // canEdit={stripes.hasPerm('ui-idm-connect.item.put')}
        handlers={{
          onClose: this.handleClose,
          onEdit: this.handleEdit,
        }}
        isLoading={_.get(this.props.resources, 'source.isPending', true)}
        // record={_.get(this.props.resources, 'source.records', []).find(i => i.id === this.props.match.params.id)}
        record={record}
        stripes={this.props.stripes}
      />
    );
  }
}

export default stripesConnect(WalkInContractViewRoute);
