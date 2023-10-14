/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import { addMedia } from '@store/actions/media.actions';

// ** Get Market Contents
export const getMarketContents = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/market/contents/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_MARKET_CONTENTS',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Add Market Content
export const addMarketContent = (marketContent) => async (dispatch) => {
  const contentLogo = marketContent.contentLogo ? marketContent.contentLogo : '';
  delete marketContent.contentLogo;

  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/market/content/create/`, marketContent, {
      headers,
    })
    .then(async (response) => {
      const marketContentObjId = response.data.content._id;
      dispatch({
        type: 'ADD_MARKET_CONTENT',
        selectedMarketContent: response.data.content,
      });
      // Add Logo if Populated
      if (contentLogo) {
        await dispatch(addMedia(contentLogo, marketContentObjId, 'MarketContent', 'contentLogo'));
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

// ** Get Market Content
export const getMarketContent = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/market/content/detail/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_MARKET_CONTENT',
        selectedMarketContent: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Update Market Content
export const updateMarketContent = (id, data) => async (dispatch, getState) => {
  const contentLogo = data.contentLogo ? data.contentLogo : '';
  delete data.contentLogo;

  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/market/content/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async () => {
      dispatch({
        type: 'UPDATE_MARKET_CONTENT',
      });
      // Update Logo if Populated
      if (contentLogo) {
        await dispatch(addMedia(contentLogo, id, 'MarketContent', 'contentLogo'));
      }
    })
    .then(() => {
      dispatch(getMarketContent(id));
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

// ** Get Market Works
export const getMarketWorks = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/market/works/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_MARKET_WORKS',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Add Market Work
export const addMarketWork = (marketWork) => async (dispatch) => {
  const workLogo = marketWork.workLogo ? marketWork.workLogo : '';
  delete marketWork.workLogo;

  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/market/work/create/`, marketWork, {
      headers,
    })
    .then(async (response) => {
      const marketWorkObjId = response.data.work._id;
      dispatch({
        type: 'ADD_MARKET_WORK',
        selectedMarketWork: response.data.work,
      });
      // Add Logo if Populated
      if (workLogo) {
        await dispatch(addMedia(workLogo, marketWorkObjId, 'MarketWork', 'workLogo'));
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

// ** Get Market Work
export const getMarketWork = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/market/work/detail/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_MARKET_WORK',
        selectedMarketWork: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Update Market Work
export const updateMarketWork = (id, data) => async (dispatch, getState) => {
  const workLogo = data.workLogo ? data.workLogo : '';
  delete data.workLogo;

  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/market/work/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async () => {
      dispatch({
        type: 'UPDATE_MARKET_WORK',
      });
      // Update Logo if Populated
      if (workLogo) {
        await dispatch(addMedia(workLogo, id, 'MarketWork', 'workLogo'));
      }
    })
    .then(() => {
      dispatch(getMarketWork(id));
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

// ** Get Market Partner
export const getMarketPartners = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/market/partners/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_MARKET_PARTNERS',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Add Market Partner
export const addMarketPartner = (marketPartner) => async (dispatch) => {
  const partnerLogo = marketPartner.partnerLogo ? marketPartner.partnerLogo : '';
  delete marketPartner.partnerLogo;

  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/market/partner/create/`, marketPartner, {
      headers,
    })
    .then(async (response) => {
      const marketPartnerObjId = response.data.partner._id;
      dispatch({
        type: 'ADD_MARKET_PARTNER',
        selectedMarketPartner: response.data.partner,
      });
      // Add Logo if Populated
      if (partnerLogo) {
        await dispatch(addMedia(partnerLogo, marketPartnerObjId, 'MarketPartner', 'partnerLogo'));
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

// ** Get Market Partner
export const getMarketPartner = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/market/partner/detail/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_MARKET_PARTNER',
        selectedMarketPartner: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Update Market Partner
export const updateMarketPartner = (id, data) => async (dispatch) => {
  const partnerLogo = data.partnerLogo ? data.partnerLogo : '';
  delete data.partnerLogo;

  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/market/partner/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async () => {
      dispatch({
        type: 'UPDATE_MARKET_PARTNER',
      });
      // Update Logo if Populated
      if (partnerLogo) {
        await dispatch(addMedia(partnerLogo, id, 'MarketPartner', 'partnerLogo'));
      }
    })
    .then(() => {
      dispatch(getMarketPartner(id));
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

// ** Get Market Schools
export const getMarketSchools = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/market/schools/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_MARKET_SCHOOLS',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market School
export const getMarketSchool = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/market/school/detail/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_MARKET_SCHOOL',
        selectedMarketSchool: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Add Market School
export const addMarketSchool = (marketSchool) => async (dispatch) => {
  const schoolLogo = marketSchool.schoolLogo ? marketSchool.schoolLogo : '';
  delete marketSchool.schoolLogo;

  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/market/school/create/`, marketSchool, {
      headers,
    })
    .then(async (response) => {
      const marketSchoolObjId = response.data.school._id;
      dispatch({
        type: 'ADD_MARKET_SCHOOL',
        selectedMarketSchool: response.data.school,
      });
      // Add Logo if Populated
      if (schoolLogo) {
        await dispatch(addMedia(schoolLogo, marketSchoolObjId, 'MarketSchool', 'schoolLogo'));
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

// ** Update Market School
export const updateMarketSchool = (id, data) => async (dispatch, getState) => {
  const schoolLogo = data.schoolLogo ? data.schoolLogo : '';
  delete data.schoolLogo;

  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/market/school/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async () => {
      dispatch({
        type: 'UPDATE_MARKET_SCHOOL',
      });
      // Update Logo if Populated
      if (schoolLogo) {
        await dispatch(addMedia(schoolLogo, id, 'MarketSchool', 'schoolLogo'));
      }
    })
    .then(() => {
      dispatch(getMarketSchool(id));
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

// ** Get Market Provides
export const getMarketProvides = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/market/provides/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_MARKET_PROVIDES',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Provide
export const getMarketProvide = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/market/provide/detail/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_MARKET_PROVIDE',
        selectedMarketProvide: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Add Market Provide
export const addMarketProvide = (marketProvide) => async (dispatch) => {
  const provideLogo = marketProvide.provideLogo ? marketProvide.provideLogo : '';
  delete marketProvide.provideLogo;

  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/market/provide/create/`, marketProvide, {
      headers,
    })
    .then(async (response) => {
      const marketProvideObjId = response.data.provide._id;
      dispatch({
        type: 'ADD_MARKET_PROVIDE',
        selectedMarketProvide: response.data.provide,
      });
      // Add Logo if Populated
      if (provideLogo) {
        await dispatch(addMedia(provideLogo, marketProvideObjId, 'MarketProvide', 'provideLogo'));
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

// ** Update Market Provide
export const updateMarketProvide = (id, data) => async (dispatch, getState) => {
  const provideLogo = data.provideLogo ? data.provideLogo : '';
  delete data.provideLogo;

  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/market/provide/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async () => {
      dispatch({
        type: 'UPDATE_MARKET_PROVIDE',
      });
      // Update Logo if Populated
      if (provideLogo) {
        await dispatch(addMedia(provideLogo, id, 'MarketProvide', 'provideLogo'));
      }
    })
    .then(() => {
      dispatch(getMarketProvide(id));
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

// ** Get Market Feedback
export const getMarketFeedbacks = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/market/feedbacks/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_MARKET_FEEDBACKS',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Feedback
export const getMarketFeedback = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/market/feedback/detail/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_MARKET_FEEDBACK',
        selectedMarketFeedback: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Add Market Feedback
export const addMarketFeedback = (marketFeedback) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/market/feedback/create/`, marketFeedback, {
      headers,
    })
    .then(async (response) => {
      dispatch({
        type: 'ADD_MARKET_FEEDBACK',
        selectedMarketProvide: response.data.provide,
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

// ** Update Market Feedback
export const updateMarketFeedback = (id, data) => async (dispatch) => {
  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/market/feedback/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async () => {
      dispatch({
        type: 'UPDATE_MARKET_FEEDBACK',
      });
    })
    .then(() => {
      dispatch(getMarketFeedback(id));
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

// ** Get Market Site Schools
export const getMarketSiteSchools = () => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/marketSite/schools/`).then((response) => {
    dispatch({
      type: 'GET_MARKETSITE_SCHOOLS',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Site Schools
export const getMarketSiteProvides = () => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/marketSite/provides/`).then((response) => {
    dispatch({
      type: 'GET_MARKETSITE_PROVIDES',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Site Land Content
export const getMarketSiteLandContent = (params) => async (dispatch) => {
  dispatch({ type: 'GET_MARKETSITE_LAND_CONTENT_REQUEST' });
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/marketSite/content/`, {
    params,
  }).then((response) => {
    dispatch({
      type: 'GET_MARKETSITE_LAND_CONTENT',
      data: response.data.result,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Site Parent Content
export const getMarketSiteParentContent = (params) => async (dispatch) => {
  dispatch({ type: 'GET_MARKETSITE_PARENT_CONTENT_REQUEST' });
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/marketSite/content/`, {
    params,
  }).then((response) => {
    dispatch({
      type: 'GET_MARKETSITE_PARENT_CONTENT',
      data: response.data.result,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Site School Content
export const getMarketSiteSchoolContent = (params) => async (dispatch) => {
  dispatch({ type: 'GET_MARKETSITE_SCHOOL_CONTENT_REQUEST' });
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/marketSite/content/`, {
    params,
  }).then((response) => {
    dispatch({
      type: 'GET_MARKETSITE_SCHOOL_CONTENT',
      data: response.data.result,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Site Store Content
export const getMarketSiteStoreContent = (params) => async (dispatch) => {
  dispatch({ type: 'GET_MARKETSITE_STORE_CONTENT_REQUEST' });
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/marketSite/content/`, {
    params,
  }).then((response) => {
    dispatch({
      type: 'GET_MARKETSITE_STORE_CONTENT',
      data: response.data.result,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Site Work
export const getMarketSiteWork = () => async (dispatch) => {
  // dispatch({ type: 'GET_MARKETSITE_WORK_REQUEST' });
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/marketSite/works/`).then((response) => {
    dispatch({
      type: 'GET_MARKETSITE_WORK',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Site Partner
export const getMarketSitePartners = () => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/marketSite/partners/`).then((response) => {
    dispatch({
      type: 'GET_MARKETSITE_PARTNER',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Market Site Feedback
export const getMarketSiteFeedbacks = () => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/marketSite/feedbacks/`).then((response) => {
    dispatch({
      type: 'GET_MARKETSITE_FEEDBACKS',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};
