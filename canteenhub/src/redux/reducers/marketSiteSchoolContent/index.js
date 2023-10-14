// ** Initial State
const initialState = {
  data: null,
};

const marketSiteSchoolContent = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKETSITE_SCHOOL_CONTENT_REQUEST':
      return { loading: true, error: '', data: null };
    case 'GET_MARKETSITE_SCHOOL_CONTENT':
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    default:
      return { ...state };
  }
};

export default marketSiteSchoolContent;
