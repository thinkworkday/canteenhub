// ** Initial State
const initialState = {
  data: [],
  selectedMarketSchool: null,
};

const marketSchool = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKET_SCHOOLS':
      return {
        ...state,
        data: action.data,
      };
    case 'GET_MARKET_SCHOOL':
      return {
        ...state,
        selectedMarketSchool: action.selectedMarketSchool,
      };
    case 'ADD_MARKET_SCHOOL':
      return { ...state, selectedMarketSchool: action.selectedMarketSchool };
    case 'UPDATE_MARKET_SCHOOL':
      return { ...state };
    case 'DELETE_MARKET_SCHOOL':
      return { ...state };
    default:
      return { ...state };
  }
};

export default marketSchool;
