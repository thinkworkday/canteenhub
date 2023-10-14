// ** Initial State
const initialState = {
  // allData: [],
  data: [],
  total: 1,
  params: {},
  selectedStore: null,
};

const stores = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_STORES':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_STORE':
      return { ...state, selectedStore: action.selectedStore };
    case 'GET_URL':
      return { ...state, selectedUrl: action.selectedStore };
    case 'ADD_STORE':
      return { ...state, selectedStore: action.selectedStore };
    case 'UPDATE_STORE':
      return { ...state };
    case 'DELETE_STORE':
      return { ...state };
    default:
      return { ...state };
  }
};
export default stores;
