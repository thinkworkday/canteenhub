// ** Initial State
const initialState = {
  // allData: [],
  data: [],
  total: 1,
  params: {},
  selectedMenu: null,
  menuOptions: null,
  tags: {},
};

const menus = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_MENUS':
      return {
        ...state,
        data: action.data,
        totalCount: action.totalCount,
        filteredCount: action.filteredCount,
        params: action.params,
      };
    case 'GET_MENU':
      return { ...state, selectedMenu: action.selectedMenu };
    case 'ADD_MENU':
      return { ...state, selectedMenu: action.selectedMenu };
    case 'UPDATE_MENU':
      return { ...state };
    case 'DELETE_MENU':
      return { ...state };
    case 'GET_TAGS':
      return {
        ...state,
        tags: action.tags,
      };

    case 'ADD_MENU_OPTION':
      return { ...state, selectedOption: action.selectedRecord };
    case 'GET_MENU_OPTION':
      return { ...state, selectedOption: action.selectedRecord };
    case 'GET_MENU_OPTIONS':
      return { ...state, menuOptions: action.data };
    default:
      return { ...state };
  }
};

export default menus;
