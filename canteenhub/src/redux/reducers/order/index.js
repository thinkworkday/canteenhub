// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {},
  selectedOrder: null,
  tags: {},
};

const orders = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDERS':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_ORDER':
      return { ...state, selectedOrder: action.selectedOrder };
    case 'ADD_ORDER':
      return { ...state, createdOrders: action.createdOrders };
    case 'UPDATE_ORDER':
      return { ...state };
    case 'DELETE_ORDER':
      return { ...state };
    default:
      return { ...state };
  }
};

export default orders;
