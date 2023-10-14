// ** Initial State
const initialState = {
  data: [],
};

const marketSitePartner = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKETSITE_PARTNER_REQUEST':
      return { loading: true, error: '', data: [] };
    case 'GET_MARKETSITE_PARTNER':
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    default:
      return { ...state };
  }
};

export default marketSitePartner;
