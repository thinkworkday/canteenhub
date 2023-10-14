// ** Initial State
const initialState = {
  data: [],
  selectedMarketContent: null,
};

const marketContent = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKET_CONTENTS':
      return {
        ...state,
        data: action.data,
      };
    case 'GET_MARKET_CONTENT':
      return {
        ...state,
        selectedMarketContent: action.selectedMarketContent,
      };
    case 'ADD_MARKET_CONTENT':
      return { ...state, selectedMarketContent: action.selectedMarketContent };
    case 'UPDATE_MARKET_CONTENT':
      return { ...state };
    case 'DELETE_MARKET_CONTENT':
      return { ...state };
    default:
      return { ...state };
  }
};

export default marketContent;
