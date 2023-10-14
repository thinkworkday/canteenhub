// ** Initial State
const initialState = {
  // allData: [],
  data: [],
  total: 1,
  params: {},
  selectedCharity: null,
};

const charities = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CHARITIES':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_CHARITY':
      return { ...state, selectedCharity: action.selectedCharity };
    case 'ADD_CHARITY':
      return { ...state, selectedCharity: action.selectedCharity };
    case 'UPDATE_CHARITY':
      return { ...state };
    case 'DELETE_CHARITY':
      return { ...state };
    default:
      return { ...state };
  }
};
export default charities;
