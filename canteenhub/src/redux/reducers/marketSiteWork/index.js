// ** Initial State
const initialState = {
  data: [],
};

const marketSiteWork = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKETSITE_WORK_REQUEST':
      return { loading: true, error: '', data: null };
    case 'GET_MARKETSITE_WORK':
      return {
        ...state,
        data: action.data,
        // loading: false,
      };
    default:
      return { ...state };
  }
};

export default marketSiteWork;
