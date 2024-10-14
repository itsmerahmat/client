import {useCurrentUserStore} from '@/stores/current-user.store'
import axios from 'axios'

const axiosApi = axios.create()

axiosApi.interceptors.request.use(
  async (config) => {
    const store = useCurrentUserStore()
    config.headers.set({
      Authorization: `Bearer ${store.accessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptor for API calls
// axiosApi.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   async function (error) {
//     const originalRequest = error.config
//     if (
//       error.response.status === 401 &&
//       originalRequest.url != '/api/users/auth' &&
//       !originalRequest._retry
//     ) {
//       const store = useCurrentUserStore()
//       originalRequest._retry = true
//       axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.accessToken
//       return axiosApi(originalRequest)
//     }
//     return Promise.reject(error)
//   }
// )

export default axiosApi
