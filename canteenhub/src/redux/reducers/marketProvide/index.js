// ** Initial State
const initialState = {
  data: [],
  selectedMarketProvide: null,
};

const marketProvide = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKET_PROVIDES':
      return {
        ...state,
        data: action.data,
      };
    case 'GET_MARKET_PROVIDE':
      return {
        ...state,
        selectedMarketProvide: action.selectedMarketProvide,
      };
    case 'ADD_MARKET_PROVIDE':
      return { ...state, selectedMarketProvide: action.selectedMarketProvide };
    case 'UPDATE_MARKET_PROVIDE':
      return { ...state };
    case 'DELETE_MARKET_PROVIDE':
      return { ...state };
    default:
      return { ...state };
  }
};

export default marketProvide;
