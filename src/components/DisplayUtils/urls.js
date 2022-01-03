const urls = {
  contracts: () => '/idm-connect',
  contractView: id => `/idm-connect/view/${id}`,
  contractEdit: id => `/idm-connect/${id}/edit`,
  contractCreate: () => '/idm-connect/create',
  searchIdm: () => '/idm-connect/search-idm',

  userView: id => `/users/preview/${id}`,
};

export default urls;
