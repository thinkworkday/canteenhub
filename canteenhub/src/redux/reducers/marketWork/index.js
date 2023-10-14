// ** Initial State
const initialState = {
  data: [],
  selectedMarketWork: null,
};

const marketWork = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKET_WORKS':
      return {
        ...state,
        data: action.data,
      };
    case 'GET_MARKET_WORK':
      return {
        ...state,
        selectedMarketWork: action.selectedMarketWork,
      };
    case 'ADD_MARKET_WORK':
      return { ...state, selectedMarketWork: action.selectedMarketWork };
    case 'UPDATE_MARKET_WORK':
      return { ...state };
    case 'DELETE_MARKET_WORK':
      return { ...state };
    default:
      return { ...state };
  }
};

export default marketWork;
