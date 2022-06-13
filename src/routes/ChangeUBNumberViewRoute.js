import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';

import urls from '../components/DisplayUtils/urls';
import ChangeUBNumberView from '../components/view/SearchIdm/ChangeUBNumber/ChangeUBNumberView';
import getInitialValues from '../components/view/SearchIdm/ChangeUBNumber/Helper';

class ChangeUBNumberViewRoute extends React.Component {
  static propTypes = {
    history: ReactRouterPropTypes.history.isRequired,
  };

  handleClose = () => {
    // remove item
    localStorage.removeItem('idmConnectChangeUBNumber');
    this.props.history.push(`${urls.changeUBNumber()}`);
  }

  handleSubmit = (newUBReaderNumber) => {
    const { history } = this.props;
    const adaptedInitialValues = getInitialValues();

    console.log('mach was');
    console.log(newUBReaderNumber);
    console.log(adaptedInitialValues);

    // mutator.contracts
    //   .POST(contract)
    //   .then(({ id }) => {
    //     history.push(`${urls.contractView(id)}${location.search}`);
    //   });

    return null;
  }

  render() {
    return (
      <ChangeUBNumberView
        handlers={{
          onClose: this.handleClose,
        }}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(ChangeUBNumberViewRoute);
