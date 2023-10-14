import React, { useEffect } from 'react';
import axios from 'axios';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { handleLogout } from '@store/actions/auth';

const checkRequests = (Wrapped) => {
  function CheckRequests(props) {
    // ** Store Vars
    const dispatch = useDispatch();
    useEffect(() => {
      axios.defaults.withCredentials = true;
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            switch (error.response.status) {
              case 503:
                dispatch(handleLogout());
                window.location.href = '/misc/server-deploy';
                break;
              default:
                break;
            }
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            window.location.href = '/misc/not-connected';
          } else {
            // Something happened in setting up the request that triggered an Error
          }

          return Promise.reject(error);
        }
      );
    });

    return (
      <Wrapped {...props} />
    );
  }
  return CheckRequests;
};

export default checkRequests;
