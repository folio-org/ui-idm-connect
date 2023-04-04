import React from 'react';
import PropTypes from 'prop-types';
import { getFormValues } from 'redux-form';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import ChangeUBNumber from '../components/view/SearchIdm/ChangeUBNumber/ChangeUBNumber';
import { handleIdmSearchClose, handleIdmSearchSubmit } from '../util/handler';

class ChangeUBNumberRoute extends React.Component {
  static contextType = CalloutContext;

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      renderListOfResults: false,
      isUsersResultsEmpty: false,
    };
  }

  render() {
    const formValues = getFormValues('ChangeUBNumberForm')(this.props.stripes.store.getState()) || {};

    return (
      <ChangeUBNumber
        handlers={{ onClose: () => handleIdmSearchClose(this) }}
        isUsersResultsEmpty={this.state.isUsersResultsEmpty}
        onSubmit={(e) => handleIdmSearchSubmit(this, 'ChangeUBNumberForm', e)}
        renderListOfResults={this.state.renderListOfResults}
        searchValues={formValues}
        users={this.state.users}
      >
        {this.props.children}
      </ChangeUBNumber>
    );
  }
}

ChangeUBNumberRoute.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  stripes: PropTypes.shape({
    okapi: PropTypes.shape({
      tenant: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
      url: PropTypes.string,
    }),
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

export default stripesConnect(ChangeUBNumberRoute);
