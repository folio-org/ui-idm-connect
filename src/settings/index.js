import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import GeneralSettings from './general-settings';

const IdmConnectSettings = ({
  location,
  match,
  stripes,
}) => {
  const pages = [
    {
      route: 'general',
      label: <FormattedMessage id="ui-idm-connect.settings.general" />,
      component: GeneralSettings,
    },
  ];

  return (
    <Settings
      location={location}
      match={match}
      pages={pages}
      paneTitle="ui-idm-connect"
      stripes={stripes}
    />
  );
};

IdmConnectSettings.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default IdmConnectSettings;
