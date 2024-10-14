import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export const useCurrentUserStore = defineStore('currentUser', () => {
  const accessToken: Ref<string | null> = ref(localStorage.getItem('accessToken'))

  const isLogged = (): Boolean => {
    // if (refreshToken.value !== null) {
    //   const expiry = JSON.parse(atob(refreshToken.value.split('.')[1])).exp
    //   return Math.floor(new Date().getTime() / 1000) < expiry
    // } else if (refreshToken.value == '') {
    //   return false
    // }
    return false
  }

  const setAccessToken = (token: string) => {
    accessToken.value = token
    localStorage.setItem('accessToken', token)
  }

  const setToken = (newAccessToken: string) => {
    accessToken.value = newAccessToken
    localStorage.setItem('accessToken', newAccessToken)
  }

  const userProfile = computed((): any => {
    // if (accessToken.value) {
    //   const token = accessToken.value
    //   return jwtDecode<UserProfile>(token)
    // } else if (refreshToken.value) {
    //   const token = refreshToken.value
    //   return jwtDecode<{ userProfile: UserProfile }>(token).userProfile
    // }
    return null
  })

  const destroyToken = () => {
    accessToken.value = null
    localStorage.removeItem('accessToken')
  }

  return {
    userProfile,
    accessToken,
    setAccessToken,
    setToken,
    isLogged,
    destroyToken,
  }
})
