// ** Initial State
const initialState = {
  // allData: [],
  data: [],
  total: 1,
  params: {},
  selectedProfile: null,
};

const profiles = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PROFILES':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_PROFILE':
      return { ...state, selectedProfile: action.selectedProfile };
    case 'ADD_PROFILE':
      return { ...state };
    case 'SELECT_PROFILE':
      return { ...state, selectedProfile: action.profile };
    case 'DELETE_PROFILE':
      return { ...state };
    default:
      return { ...state };
  }
};
export default profiles;
