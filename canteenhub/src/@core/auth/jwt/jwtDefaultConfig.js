// ** Auth Endpoints
export default {
  loginEndpoint: `${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
  registerEndpoint: `${process.env.REACT_APP_SERVER_URL}/api/auth/register`, 
  refreshEndpoint: `${process.env.REACT_APP_SERVER_URL}/api/auth/refreshToken`, 
  logoutEndpoint: '/jwt/logout',
  
  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
};
