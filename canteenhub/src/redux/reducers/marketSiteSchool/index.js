// ** Initial State
const initialState = {
  data: [],
};

const marketSiteSchool = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKETSITE_SCHOOLS':
      return {
        ...state,
        data: action.data,
      };
    default:
      return { ...state };
  }
};

export default marketSiteSchool;
