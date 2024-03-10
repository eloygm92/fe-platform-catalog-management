<template>
  <a
    @click="handleClick"
    class="squared block"
    :id="'watchlist-' + watchable_id"
  >
    <IconBookmark :class="useClass"/>
  </a>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import * as APIHandler from "@/lib/APIHandler";
import IconBookmark from "@/components/icons/IconBookmark.vue";
import {useUserStore} from "@/stores/user";
import getWatchlist from "@/lib/watchlistData";

const props = defineProps({
  watchable_id: {
    type: Number,
    required: true
  },
  checked: {
    type: Boolean,
    required: false
  }
})

const userStore = useUserStore()
const active = ref<boolean>(props.checked)
const useClass = ref<string>('')

onBeforeMount(() => {
  if (active.value) {
    useClass.value = 'opacity-100'
  } else {
    useClass.value = 'opacity-60'
  }
})

const handleClick = async () => {
  if(userStore.user) {
    if (active.value) {
      const response = await APIHandler.remove(`watchlist/${userStore.user.id}/${props.watchable_id}`)
      if (response.ok) {
        showNotification('Eliminado de la lista de visualización', 'success')
        await getWatchlist();
      }
      useClass.value = 'opacity-60'
    } else {
      const response = await APIHandler.post('watchlist', {
        user: userStore.user.id,
        watchable: props.watchable_id,
        view: false,
      })
      if (response.ok) {
        showNotification('Añadido a la lista de visualización', 'success')
        await getWatchlist();
      }
      useClass.value = 'opacity-100'
    }
    active.value = !active.value
  }
}

const showNotification = (message: string, type: string) => ElMessage({ message: message, type: type })
</script>

<style scoped>
.squared {
  width: 24px;
}
</style>