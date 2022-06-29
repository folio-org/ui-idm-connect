const urls = {
  contracts: () => '/idm-connect',
  contractView: id => `/idm-connect/view/${id}`,
  contractEdit: id => `/idm-connect/${id}/edit`,
  contractCreate: () => '/idm-connect/create',
  searchIdm: () => '/idm-connect/search-idm',
  changeUBNumber: () => '/idm-connect/change-ubnumber',
  changeUBNumberView: unilogin => `/idm-connect/change-ubnumber/view/${unilogin}`,
  userView: id => `/users/preview/${id}`,
  userSearch: id => `/users?query=${id}`,
};

export default urls;
