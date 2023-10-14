// ** Initial State
const initialState = {
  // allData: [],
  data: [],
  total: 1,
  params: {},
  selectedGroup: null,
};

const groups = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_GROUPS':
      return {
        ...state,
        data: action.data,
        // totalCount: action.totalCount,
        // filteredCount: action.filteredCount,
        // params: action.params,
      };
    case 'GET_GROUP':
      return { ...state, selectedGroup: action.group };
    case 'ADD_GROUP':
      return { ...state, selectedGroup: action.group };
    case 'UPDATE_GROUP':
      return { ...state };
    case 'DELETE_GROUP':
      return { ...state };
    default:
      return { ...state };
  }
};
export default groups;
