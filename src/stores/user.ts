import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IUser } from '@/lib/types/customTypes'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<IUser>({})

    function setUser(newUser: IUser) {
      user.value = newUser
    }

    return { user, setUser }
  },
  {
    persist: true
  }
)
