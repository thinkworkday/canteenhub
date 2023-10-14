// ** Initial State
const initialState = {
  data: {},
};

const newletterView = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_NEWSLETTER_VIEW_REQUEST':
      return { loading: true, error: '', data: {} };
    case 'GET_NEWSLETTER_VIEW':
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    default:
      return { ...state };
  }
};

export default newletterView;
