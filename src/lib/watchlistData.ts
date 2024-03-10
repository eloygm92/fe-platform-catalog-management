import * as APIHandler from "@/lib/APIHandler";
import {useUserStore} from "@/stores/user";
import {useWatchlistStore} from "@/stores/watchlist";

export default async function getWatchlist() {
  const userStore = useUserStore();
  const watchlistStore = useWatchlistStore();

  const response = await APIHandler.get(`watchlist/${userStore.user.id}`)

  if (response) {
    watchlistStore.setWatchlist(response)
  }
}