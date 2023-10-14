// ** Initial State
const initialState = {
  data: null,
};

const marketSiteParentContent = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MARKETSITE_PARENT_CONTENT_REQUEST':
      return { loading: true, error: '', data: null };
    case 'GET_MARKETSITE_PARENT_CONTENT':
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    default:
      return { ...state };
  }
};

export default marketSiteParentContent;
