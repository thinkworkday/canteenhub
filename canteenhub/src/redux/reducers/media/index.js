// ** Initial State
const initialState = {
  // allData: [],
  data: [],
  total: 1,
  params: {},
  selectedMedia: null,
};

const store = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_MEDIA':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_MEDIA':
      return { ...state, selectedStore: action.selectedStore };
    case 'ADD_MEDIA':
      return { ...state };
    case 'DELETE_MEDIA':
      return { ...state };
    default:
      return { ...state };
  }
};
export default store;
