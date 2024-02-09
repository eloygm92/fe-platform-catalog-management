import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IUser } from '@/lib/types/customTypes'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<undefined | IUser>(undefined);

    function setUser(newUser: IUser | undefined) {
      user.value = newUser;
    }

    return { user, setUser };
  },
  {
    persist: true
  }
)
