import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export const useCurrentUserStore = defineStore('currentUser', () => {
  const accessToken: Ref<string | null> = ref(localStorage.getItem('token'))
  const user: Ref<any> = ref(localStorage.getItem('user'))

  const isLogged = (): Boolean => {
    if (accessToken.value) {
      return true
    }
    return false
  }

  const setTokenAndUser = (token: string, user: any) => {
    accessToken.value = token
    user.value = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const userProfile = computed((): any => {
    if (user.value) {
      return JSON.parse(user.value)
    }
    return null
  })

  const revokeToken = () => {
    accessToken.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const destroyToken = () => {
    accessToken.value = null
    localStorage.removeItem('accessToken')
  }

  return {
    userProfile,
    accessToken,
    setTokenAndUser,
    revokeToken,
    isLogged,
    destroyToken,
  }
})
