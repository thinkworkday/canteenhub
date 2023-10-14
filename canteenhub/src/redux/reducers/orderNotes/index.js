// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {},
  selectedOrder: null,
  tags: {},
};

const ordersNotes = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDER_NOTES':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_ORDER_NOTE':
      return { ...state, selectedOrderNote: action.selectedOrderNote };
    case 'ADD_ORDER_NOTE':
      return { ...state, createdOrders: action.createdOrders };
    case 'UPDATE_ORDER_NOTE':
      return { ...state };
    case 'DELETE_ORDER_NOTE':
      return { ...state };
    default:
      return { ...state };
  }
};

export default ordersNotes;
