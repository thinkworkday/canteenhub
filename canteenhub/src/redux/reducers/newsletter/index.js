// ** Initial State
const initialState = {
  data: {},
};

const newsletter = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_NEWSLETTER':
      return {
        ...state,
        data: action.data,
      };
    case 'UPDATE_NEWSLETTER':
      return { ...state };
    default:
      return { ...state };
  }
};

export default newsletter;
