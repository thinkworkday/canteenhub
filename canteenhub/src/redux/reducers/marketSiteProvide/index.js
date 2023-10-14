// ** Initial State
const initialState = {
  data: [],
};

const marketSiteProvide = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKETSITE_PROVIDES':
      return {
        ...state,
        data: action.data,
      };
    default:
      return { ...state };
  }
};

export default marketSiteProvide;
