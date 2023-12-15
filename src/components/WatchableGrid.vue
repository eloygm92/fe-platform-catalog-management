<template>
  <a @click="handleClick">
    <el-card :body-style="{ padding: '0px' }">
      <el-image :src="image_url" class="w-full image" fit="cover" lazy />
    </el-card>
  </a>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IWatchable } from '@/lib/types/customTypes'
import type { RouteParams } from 'vue-router'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'

const router = useRouter()
const store = useContentStore()

const props = defineProps({
  watchable: {
    type: Object<IWatchable>,
    required: true
  }
})

const watchableData = ref<IWatchable>(props.watchable)

const image_url = ref<string>(
  props.watchable.poster_path
    ? import.meta.env.VITE_IMG_CDN + 'w185/' + props.watchable.poster_path
    : import.meta.env.VITE_404_IMG
)
//const toParams = ref<RouteParams>({ path: '/watchable/'+ props.watchable.id, component: WatchableDetail, watchable: props.watchable })
const toParams = ref<RouteParams>({
  name: 'watchableDetail',
  props: { watchable: watchableData },
  params: { id: props.watchable.id }
})

const handleClick = () => {
  store.setWatchable(watchableData.value)
  router.push(toParams.value)
}
</script>

<style scoped>
.image {
  width: 185px;
  height: 100%;
}
.el-card {
  width: 185px;
  margin: 10px;
  height: 280px;
}
</style>
