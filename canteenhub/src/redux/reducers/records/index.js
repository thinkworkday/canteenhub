// ** Initial State
const initialState = {
  // allData: [],
  data: [],
  total: 1,
  params: {},
  selectedRecord: null,
};

const records = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_RECORDS':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_RECORD':
      return { ...state, selectedRecord: action.selectedRecord };
    case 'ADD_RECORD':
      return { ...state, selectedRecord: action.selectedRecord };
    case 'UPDATE_RECORD':
      return { ...state };
    case 'DELETE_RECORD':
      return { ...state };
    default:
      return { ...state };
  }
};
export default records;
