import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'

import { handleLogout } from '@store/actions/auth'


axios.defaults.withCredentials = true
export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []
  

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }
    // ** Add request/response interceptor

    // ** Request Interceptor
    axios.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        const accessToken = this.getToken()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    axios.interceptors.response.use(
      (response) => { return response },
      error => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config
        // ** if (status === 401) {
        if (response && response.status === 401) {
          if (originalRequest.url === this.jwtConfig.refreshEndpoint) {
            // Refresh token expired
            // dispatch(handleLogout());
            localStorage.removeItem('userData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('selectedMonth');
            // console.log('Im logging out 1');
            // window.location = `${process.env.REACT_APP_SITE_URL}/login/timeout`;
          } else {
            if (!this.isAlreadyFetchingAccessToken) {
              this.isAlreadyFetchingAccessToken = true
              this.refreshToken().then(r => {
                this.isAlreadyFetchingAccessToken = false
                // ** Update accessToken in localStorage
                this.setToken(r.data.accessToken);
                this.onAccessTokenFetched(r.data.accessToken);
              }).catch(function (error) {
                //redirect to login
                localStorage.removeItem('userData');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('selectedMonth');
                // console.log('Im logging out 2');

                // window.location = `${process.env.REACT_APP_SITE_URL}/login/timeout`;
              })
            }
            const retryOriginalRequest = new Promise((resolve) => {
              this.addSubscriber((accessToken) => {
                // ** Make sure to assign accessToken according to your response.
                // ** Check: https://pixinvent.ticksy.com/ticket/2413870
                // ** Change Authorization header
                originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
                // resolve(this.axios(originalRequest))
                resolve(axios.request(originalRequest))
              })
            })
            return retryOriginalRequest
          }
        }
        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }
  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args, {
      withCredentials: true, // Now this is was the missing piece in the client side 
    })
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint);
  }
}
