import React from 'react';
import PropTypes from 'prop-types';
import { Pane } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

export default class GeneralSettings extends React.Component {
  static propTypes = {
    label: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <div>
          <FormattedMessage id="ui-idm-connect.settings.general.message" />
        </div>
      </Pane>
    );
  }
}
