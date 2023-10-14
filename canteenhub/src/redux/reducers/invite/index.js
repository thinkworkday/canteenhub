// ** Initial State
const initialState = {
  // allData: [],
  data: [],
  total: 1,
  params: {},
  selectedInvite: null,
};

const invites = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_INVITES':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_INVITE':
      return { ...state, selectedInvite: action.selectedInvite };
    case 'ADD_INVITE':
      return { ...state, selectedInvite: action.selectedInvite };
    default:
      return { ...state };
  }
};
export default invites;
