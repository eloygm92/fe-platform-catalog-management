<template>
  <a @click="handleClick" class="cursor-pointer h-auto">
    <el-card :body-style="{ padding: '0px', width: '185px'/*'background-image': `url(${image_url})`, width: '185px', height: '276px'*/ }">
      <IconBookmark class="z-40 watchlist-button absolute" />
      <img :src="image_url" class="w-full image z-10" loading="lazy" :alt="'Poster de ' + watchableData.name" />
      <PopularsCircleBar :percentage="watchableData.vote_average" class="ml-1.5 rebase-image z-40 relative"/>
      <div class="grid title-zone">
        <span class="grid-rows-1 font-bold my-auto">{{ watchableData.name ?? watchableData.original_name }}</span>
        <span class="grid-rows-2">{{ watchableData.release_date }}</span>
      </div>
    </el-card>
  </a>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { IWatchable } from '@/lib/types/customTypes'
import type { RouteParams } from 'vue-router'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'
import PopularsCircleBar from "@/components/PopularsCircleBar.vue";
import IconBookmark from "@/components/icons/IconBookmark.vue";

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
    ? import.meta.env.VITE_IMG_CDN + 'w185' + props.watchable.poster_path
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
  height: 276px;
}
.el-card {
  width: 185px;
  margin: 10px;
  border-radius: 0.25rem;
}
.title-zone {
  /*padding-top: 257px;*/
  padding-left: 0.25rem;
}
.rebase-image {
  margin-top: -1.1rem;
}
.watchlist-button {
  margin-top: -0.14rem;
}
</style>
