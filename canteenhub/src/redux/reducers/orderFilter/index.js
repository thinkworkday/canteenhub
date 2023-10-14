// ** Initial State
const initialState = {
  orderFilter: {},
};

const orderFilter = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ORDER_FILTER':
      return {
        ...state,
        orderFilter: action.orderFilter,
      };
    default:
      return { ...state };
  }
};

export default orderFilter;
