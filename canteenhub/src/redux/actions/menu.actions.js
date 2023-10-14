/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import { addMedia } from '@store/actions/media.actions';

// import { addMedia } from '@store/actions/media.actions';
// import { getUsers } from './user.actions';

// ** Add Menu
export const addMenu = (menu) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/menus/create/`, menu, {
      headers,
    })
    .then(async (response) => {
      await dispatch({
        type: 'ADD_MENU',
        selectedMenu: response.data.menu,
      });
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Get Menus
export const getMenus = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/menus/list/`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_MENUS',
        data: response.data.results,
        totalCount: response.data.totalCount,
        filteredCount: response.data.filteredCount,
        params,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Get Menu
export const getMenu = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/menus/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_MENU',
        selectedMenu: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Update Menu
export const updateMenu = (id, data) => async (dispatch, getState) => {
  await axios
    .patch(`${process.env.REACT_APP_SERVER_URL}/api/menus/update/${id}`, data, {
      headers,
    })
    .then(async (response) => {
      dispatch({
        type: 'GET_MENU',
        selectedMenu: response.data.menu,
      });
    })
    .then(() => {
      dispatch(getMenus(getState().stores.params));
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Get Menu Items
export const getMenuItems = (params, parentMenuId = false) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/menuItems/list/${parentMenuId || ''}`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_RECORDS',
        data: response.data.results,
        totalCount: response.data.totalCount,
        filteredCount: response.data.filteredCount,
        params,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Get Menu Items
export const getMenuItemsFromParent = (parentMenuId) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/menuItems/listByMenu/${parentMenuId}`, {
      headers,
    })
    .then((response) => {
      dispatch({
        type: 'GET_RECORDS',
        data: response.data.results,
        totalCount: response.data.totalCount,
        filteredCount: response.data.filteredCount,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Get Menus

// export const getMenuItem = (id) => async (dispatch) => {
//   await axios
//     .get(`${process.env.REACT_APP_SERVER_URL}/api/menus/items/${id}`, { headers })
//     .then((response) => {
//       dispatch({
//         type: 'GET_RECORD',
//         selectedUser: response.data,
//       });
//     })
//     .catch((err) => console.log(err));
// };

export const getMenuItem = (id) => async (dispatch) => {
  if (!id) { return; }
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/menuItems/${id}`, {
      headers,
    })
    .then(async (response) => {
      await dispatch({
        type: 'GET_RECORD',
        selectedRecord: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Add Menu Item
export const addMenuItem = (data) => async (dispatch) => {
  const image = data.image ? data.image : '';
  delete data.image;

  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/menuItems/create/`, data, {
      headers,
    })
    .then(async (response) => {
      const objId = response.data.menuItem._id;
      dispatch({
        type: 'ADD_RECORD',
        selectedRecord: response.data.menuItem,
      });
      // Add Image if Populated
      if (image) {
        await dispatch(addMedia(image, objId, 'MenuItem', 'image'));
      }
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Update Menu Iten
export const updateMenuItem = (id, data) => async (dispatch) => {
  const image = data.image ? data.image : '';
  delete data.image;

  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/menuItems/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async (response) => {
      dispatch({
        type: 'GET_RECORD',
        selectedRecord: response.data.menuItem,
      });
      // Update Logo if Populated
      if (image) {
        await dispatch(addMedia(image, id, 'MenuItem', 'image'));
      }
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Get Menu Item Tags
export const getMyMenuItemTags = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/menuItems/tags/list/`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_TAGS',
        tags: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Add Menu Option
export const addMenuOption = (data) => async (dispatch) => {
  await axios
    .post(
      `${process.env.REACT_APP_SERVER_URL}/api/menuOptions/create/`,
      data,
      {
        headers,
      }
    )
    .then(async (response) => {
      dispatch({
        type: 'ADD_MENU_OPTION',
        selectedOption: response.data.menuOption,
      });
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Get Menu Options
export const getMenuOptions = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/menuOptions/list/`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_RECORDS',
        data: response.data.results,
        totalCount: response.data.totalCount,
        filteredCount: response.data.filteredCount,
        params,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Get Menu Items
export const getMenuOptionsFromParent = (parentMenuId) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/menuOptions/listByMenu/${parentMenuId}`, {
      headers,
    })
    .then((response) => {
      dispatch({
        type: 'GET_MENU_OPTIONS',
        data: response.data.results,
        totalCount: response.data.totalCount,
        filteredCount: response.data.filteredCount,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Update Menu Option
export const updateMenuOption = (id, data) => async (dispatch) => {
  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/menuOptions/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async (response) => {
      dispatch({
        type: 'GET_MENU_OPTION',
        selectedRecord: response.data.menuOption,
      });
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};
