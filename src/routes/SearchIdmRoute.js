import React from 'react';
import PropTypes from 'prop-types';
import { getFormValues } from 'redux-form';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';

import SearchIdm from '../components/view/SearchIdm/SearchIdm';
import { handleIdmSearchClose, handleIdmSearchSubmit } from '../util/handler';

class SearchIdmRoute extends React.Component {
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
    const isCreateNewUser = this.props.location.state === 'new';
    const formValues = getFormValues('SearchIdmForm')(this.props.stripes.store.getState()) || {};

    return (
      <SearchIdm
        handlers={{ onClose: () => handleIdmSearchClose(this) }}
        isCreateNewUser={isCreateNewUser}
        isUsersResultsEmpty={this.state.isUsersResultsEmpty}
        onSubmit={(e) => handleIdmSearchSubmit(this, 'SearchIdmForm', e)}
        renderListOfResults={this.state.renderListOfResults}
        searchValues={formValues}
        users={this.state.users}
      />
    );
  }
}

SearchIdmRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.string.isRequired,
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

export default stripesConnect(SearchIdmRoute);
