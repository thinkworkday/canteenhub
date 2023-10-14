// ** Initial State
const initialState = {
  data: [],
  selectedMarketPartner: null,
};

const marketPartner = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKET_PARTNERS':
      return {
        ...state,
        data: action.data,
      };
    case 'GET_MARKET_PARTNER':
      return {
        ...state,
        selectedMarketPartner: action.selectedMarketPartner,
      };
    case 'ADD_MARKET_PARTNER':
      return { ...state, selectedMarketPartner: action.selectedMarketPartner };
    case 'UPDATE_MARKET_PARTNER':
      return { ...state };
    case 'DELETE_MARKET_PARTNER':
      return { ...state };
    default:
      return { ...state };
  }
};

export default marketPartner;
