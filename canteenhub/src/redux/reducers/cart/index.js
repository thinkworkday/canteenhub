// ** Initial State
const initialState = {
  data: [],
  selectedOrder: null,
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CART_ORDERS':
      return {
        ...state,
        data: action.data,
      };
    case 'GET_CART_ORDER':
      return {
        ...state,
        selectedOrder: action.selectedOrder,
      };
    case 'ADD_CART_ORDER':
      return { ...state, selectedOrder: action.selectedOrder };
    case 'UPDATE_CART_ORDER':
      return { ...state };
    case 'DELETE_CART_ORDER':
      return { ...state };
    default:
      return { ...state };
  }
};

export default cart;
