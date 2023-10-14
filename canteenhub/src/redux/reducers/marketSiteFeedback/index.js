// ** Initial State
const initialState = {
  data: [],
};

const marketSiteFeedback = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKETSITE_FEEDBACKS':
      return {
        ...state,
        data: action.data,
      };
    default:
      return { ...state };
  }
};

export default marketSiteFeedback;
