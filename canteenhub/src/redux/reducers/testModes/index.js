// ** Initial State
const initialState = {
  testModeStatus: false,
};

const testModes = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TEST_MODE_DATA':
      return {
        ...state,
        testModeStatus: action.testModeStatus,
      };
    default:
      return { ...state };
  }
};
export default testModes;
