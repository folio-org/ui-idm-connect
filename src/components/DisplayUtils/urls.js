const urls = {
  contracts: () => '/idm-connect',
  contractView: id => `/idm-connect/view/${id}`,
  contractEdit: id => `/idm-connect/${id}/edit`,
  contractCreate: () => '/idm-connect/create',
};

export default urls;
