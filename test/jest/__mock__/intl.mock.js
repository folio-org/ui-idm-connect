import React from 'react';
import { IntlProvider } from 'react-intl';

import componentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import smartComponentsTranslations from '@folio/stripes-smart-components/translations/stripes-smart-components/en';
import stripesCoreTranslations from '@folio/stripes-core/translations/stripes-core/en';
import idmConnectTranslations from '../../../translations/ui-idm-connect/en';

const prefixKeys = (translations, prefix) => {
  return Object.keys(translations).reduce(
    (acc, key) => ({
      ...acc,
      [`${prefix}.${key}`]: translations[key],
    }),
    {}
  );
};

const translations = {
  ...prefixKeys(idmConnectTranslations, 'ui-idm-connect'),
  ...prefixKeys(componentsTranslations, 'stripes-components'),
  ...prefixKeys(smartComponentsTranslations, 'stripes-smart-components'),
  ...prefixKeys(stripesCoreTranslations, 'stripes-core'),
};

// const defaultRichTextElements = ['b', 'i', 'em', 'strong', 'span', 'div', 'p', 'ul', 'ol', 'li', 'code'].reduce((res, Tag) => {
//   res[Tag] = chunks => <Tag>{chunks}</Tag>;
//   return res;
// }, {});

// eslint-disable-next-line react/prop-types
const Intl = ({ children }) => (
    <IntlProvider
      // defaultRichTextElements={defaultRichTextElements}
      locale="en"
      messages={translations}
    >
      {children}
    </IntlProvider>
);

export default Intl;
