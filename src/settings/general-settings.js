import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane } from '@folio/stripes/components';

const GeneralSettings = ({ label }) => {
  return (
    <Pane defaultWidth="fill" fluidContentWidth paneTitle={label}>
      <div>
        <FormattedMessage id="ui-idm-connect.settings.general.message" />
      </div>
    </Pane>
  );
};

GeneralSettings.propTypes = {
  label: PropTypes.object.isRequired,
};

export default GeneralSettings;
