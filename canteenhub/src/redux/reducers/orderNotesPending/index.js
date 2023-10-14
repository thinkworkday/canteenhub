// ** Initial State
const initialState = {
  data: [],
  total: 1,
};

const orderNotesPending = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDER_NOTES_PENDING':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
      };
    default:
      return { ...state };
  }
};

export default orderNotesPending;
