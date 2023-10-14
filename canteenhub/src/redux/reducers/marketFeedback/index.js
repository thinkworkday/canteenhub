// ** Initial State
const initialState = {
  data: [],
  selectedMarketFeedback: null,
};

const marketFeedback = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKET_FEEDBACKS':
      return {
        ...state,
        data: action.data,
      };
    case 'GET_MARKET_FEEDBACK':
      return {
        ...state,
        selectedMarketFeedback: action.selectedMarketFeedback,
      };
    case 'ADD_MARKET_FEEDBACK':
      return { ...state, selectedMarketFeedback: action.selectedMarketFeedback };
    case 'UPDATE_MARKET_FEEDBACK':
      return { ...state };
    case 'DELETE_MARKET_FEEDBACK':
      return { ...state };
    default:
      return { ...state };
  }
};

export default marketFeedback;
