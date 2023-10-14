/* eslint-disable no-case-declarations */
// ** Initial State
const initialState = {
  events: [],
  selectedEvent: {},
  total: 1,
  selectedCalendars: [],
  params: {},
};

const events = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS':
      return { ...state, events: action.events };
    case 'ADD_EVENT':
      return { ...state };
    case 'REMOVE_EVENT':
      return { ...state };
    case 'UPDATE_EVENT':
      return { ...state };
    case 'UPDATE_FILTERS':

      // console.log('UPDATE_FILTERS', state);
      // console.log('ACTION', action.filters);
      // console.log('ACTION', Object.keys(action.filters)[0]);

      // // state.selectedCalendars.push(action.filters);
      // // state.selectedCalendars = [];

      // console.log('ACTION stats', state.selectedCalendars);

      // console.log(Object.keys(action.filters)[0] in state.selectedCalendars);

      // const filteredNumbers = state.selectedCalendars.map((filterOption) => {
      //   console.log('MAPPING', filterOption);

      //   return ((Object.keys(filterOption)[0] === Object.keys(action.filters)[0]) ? action.filters : '');
      // });

      // console.log('filteredNumbers', filteredNumbers);

      // ** Updates Filters based on action filter
      // const filterIndex = state.selectedCalendars.findIndex((i) => i === action.filter);

      // console.log('STATE', state.selectedCalendars, filterIndex);
      // if (state.selectedCalendars.includes(action.filter)) {
      //   state.selectedCalendars.splice(filterIndex, 1);
      // } else {
      //   state.selectedCalendars.push(action.filter);
      // }
      // if (state.selectedCalendars.length === 0) {
      //   state.events.length = 0;
      // }
      return { ...state };
    case 'UPDATE_ALL_FILTERS':
      // ** Updates All Filters based on action value
      // console.log('UPDATE_ALL_FILTERS');
      // const { value } = action;
      // let selected = [];
      // if (value === true) {
      //   selected = ['Personal', 'Business', 'Family', 'Holiday', 'ETC'];
      // } else {
      //   selected = [];
      // }
      // return { ...state, selectedCalendars: selected };
      return { ...state };
    case 'SELECT_EVENT':
      return { ...state, selectedEvent: action.event };
    default:
      return state;
  }
};

export default events;
