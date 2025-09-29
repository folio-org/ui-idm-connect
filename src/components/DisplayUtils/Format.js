import { FormattedMessage } from 'react-intl';

import { NoValue } from '@folio/stripes/components';

const DataLable = (field) => {
  if (field !== '') {
    return <FormattedMessage id={`ui-idm-connect.dataOption.${field}`} />;
  } else {
    return <NoValue />;
  }
};

export default DataLable;
