<template>
  <div class="mt-8 flex justify-center">
    <el-card v-if="load" :body-style="{padding: '0px'}" >
      <img v-if="watchable.backdrop_path" :src="image_base_url + watchable.backdrop_path" :alt="'Cartel ampliado de' + watchable.name" class="opacity-40 z-0">
      <img v-else src="@/assets/defaultDetailImage.jpg" alt="Imagen por defecto" class="opacity-40 z-0 fix-height" >
      <div class="z-10 relative rebase p-5">
        <el-row :gutter="24">
          <el-col :span="7" :offset="1">
            <WatchlistButton v-if="userStore.user" :watchable_id="watchable.id" :checked="inWatchlist" :size-icon="'32'" class="relative z-50 float-right mr-14 -m-2 "/>
            <el-image :src="image_url" class="image z-40 relative over-image -mb-3.5" fit="cover" />
            <SeasonChapterList v-if="watchable.type == 'tv'" :watchable_id="watchable.id" />
          </el-col>
          <el-col :span="15">
            <h1 class="pb-3">{{ watchable.name }} <span class="font-light">{{ watchable.release_date.split('-')[0] ? '(' + watchable.release_date.split('-')[0] + ')' : ''}}</span></h1>
            <h5 class="-mt-4 pb-2 mb-2 font-light">{{ formatDate(watchable.release_date) }} (ES) · {{ watchable.genres?.map(item => item.name).join(',') }}</h5>
            <div class="flex flex-row pb-2">
              <PopularsCircleBar :percentage="watchable.vote_average ?? 0" size="big" class="flex-col" />
              <span class="ml-2 w-3 justify-center items-center align-middle flex-col">Puntuación usuarios</span>
            </div>
            <h6 class="font-light py-3">{{ watchable.tagline }}</h6>
            <p class="flex text-justify">{{ watchable.overview }}</p>
            <el-col :offset="6">
              <WatchProviders :watchable_id="watchable.id" class="mt-4" />
            </el-col>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import * as APIHandler from '@/lib/APIHandler'
import type { IWatchable } from '@/lib/types/customTypes'
import { useRoute } from 'vue-router'
import PopularsCircleBar from "@/components/PopularsCircleBar.vue";
import WatchProviders from "@/components/WatchProviders.vue";
import WatchlistButton from "@/components/WatchlistButton.vue";
import {useUserStore} from "@/stores/user";
import {useWatchlistStore} from "@/stores/watchlist";
import SeasonChapterList from "@/components/SeasonChapterList.vue";

const route = useRoute()
const userStore = useUserStore()
const watchlistStore = useWatchlistStore()

const watchable = ref<IWatchable>({})
const load = ref<boolean>(false)
const inWatchlist = ref<boolean>(watchlistStore.watchlist.some(item => item.watchable_id == route.params.id))
const image_base_url = ref<string>(import.meta.env.VITE_IMG_CDN + 'w1280/')
const image_url = ref<string>(
  watchable.value.poster_path
    ? import.meta.env.VITE_IMG_CDN + watchable.value.poster_path
    : import.meta.env.VITE_404_IMG
)

onBeforeMount(async () => {
  const response = await APIHandler.get(`watchable/${route.params.id}`)
  if (response) {
    watchable.value = response
  }
  load.value = true;
})

const formatDate = (date: string) => {
  const splitted = date.split('-')
  return splitted.reverse().join('/')
}

watch(
  () => watchable.value,
  (newValue) => {
    image_url.value = newValue.poster_path
      ? import.meta.env.VITE_IMG_CDN + 'w300/' + newValue.poster_path
      : import.meta.env.VITE_404_IMG
  }
)
</script>

<style scoped>
.el-card {
  //background: #032052;
  background: #021631;
  //background: #2d080d;
  width: 1280px;
  height: 580px;
  color: #fff;
}

.el-card__body::before {
  background-size: cover;
  opacity: 0.5;
}
.image {
  border-radius: 10px;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

p {
  text-wrap: normal;
}

.rebase {
  margin-top: -42rem;
}

.over-image {
  margin-top: -1.400rem;
}

.fix-height {
  height: 720px;
  width: 1280px;
}
</style>
