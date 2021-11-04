const urls = {
  walkInContracts: () => '/idm-connect',
  walkInContractView: id => `/idm-connect/view/${id}`,
  walkInContractEdit: id => `/idm-connect/${id}/edit`,
  walkInContractCreate: () => '/idm-connect/create',
};

export default urls;
