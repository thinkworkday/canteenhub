// ** Initial State
const initialState = {
  data: [],
  total: 1,
  params: {},
  selectedTransaction: null,
  tags: {},
};

const transactions = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TRANSACTIONS':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_TRANSACTION':
      return { ...state, selectedTransaction: action.selectedTransaction };
    // case 'ADD_ORDER_NOTE':
    //   return { ...state, createdOrders: action.createdOrders };
    // case 'UPDATE_ORDER_NOTE':
    //   return { ...state };
    // case 'DELETE_ORDER_NOTE':
    //   return { ...state };
    default:
      return { ...state };
  }
};

export default transactions;
