import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IWatchlist } from '@/types/watchlist';

export const useWatchlistStore = defineStore(
  'watchlist',
  () => {
  const watchlist = ref<undefined | IWatchlist[]>(undefined);

  function setWatchlist(newWatchlist: IWatchlist[] | undefined) {
    watchlist.value = newWatchlist;
  }

  return { watchlist, setWatchlist };
},
  {
    persist: true
  }
)
