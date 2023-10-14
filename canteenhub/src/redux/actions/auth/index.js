// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

const config = useJwt.jwtConfig;

// ** Handle User Login
export const handleLogin = (data) => (dispatch) => {
  // no need to store in store
  dispatch({
    type: 'LOGIN',
    data,
    config,
    // [config.storageTokenKeyName]: data[config.storageTokenKeyName],
  });

  // ** Add to user, accessToken to localStorage
  if (data.accessToken) {
    localStorage.setItem(config.storageTokenKeyName, data.accessToken);
    delete data.accessToken;
  }
  localStorage.setItem('userData', JSON.stringify(data));
};

// ** Handle User Logout
export const handleLogout = () => (dispatch) => {
  dispatch({ type: 'LOGOUT', [config.storageTokenKeyName]: null });

  // ** Remove user, accessToken from localStorage
  localStorage.removeItem('userData');
  localStorage.removeItem('selectedMonth');
  localStorage.removeItem(config.storageTokenKeyName);
};
