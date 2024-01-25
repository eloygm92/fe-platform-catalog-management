import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IWatchable } from '@/lib/types/customTypes'

export const useContentStore = defineStore('content', () => {
  const watchable = ref<IWatchable>({})

  function setWatchable(newWatchable: IWatchable) {
    watchable.value = newWatchable
  }

  return { watchable, setWatchable }
})
