<template>
  <div class="grid lg:grid-cols-7 grid-cols-1 justify-center">
    <div class="col-span-1">
      <FiltersWatchable @filter-change="captureFilters" />
    </div>
    <div class="lg:col-span-6">
      <div
        v-if="watchables.items?.length"
        v-infinite-scroll="load"
        infinite-scroll-immediate="false"
        class="flex lg:justify-start justify-center flex-wrap overflow-auto infinite-height"
      >
        <WatchableGrid
          v-for="watchable in watchables.items"
          :key="watchable.id"
          :watchable="watchable"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import * as APIHandler from '@/lib/APIHandler'
import WatchableGrid from '@/components/WatchableGrid.vue'
import FiltersWatchable from '@/components/FiltersWatchable.vue'
import { useRoute, useRouter } from 'vue-router'
import type { IFilters, IWatchable } from '@/lib/types/customTypes'
import {useWatchlistStore} from "@/stores/watchlist";

const props = defineProps({
  filter_base: {
    type: String,
    required: false
  }
})

const route = useRoute()
const router = useRouter()
const watchlistStore = useWatchlistStore()

const sort = ref<string>('popularity:desc')
const page = ref<number>(1)
const size = ref<number>(24)
const filter = ref<string | undefined>(props.filter_base ? `type:eq:${props.filter_base}` : undefined)
const watchables = ref<{ items: IWatchable[]; totalItems: number; page: number; size: number }>({
  items: [],
  totalItems: 0,
  page: 0,
  size: 0
})

onBeforeMount(async () => {
  const response = await APIHandler.get(
    `watchable?page=${page.value}&size=${size.value}&sort=${sort.value}${
      filter.value ? `&filter=${filter.value}` : ''
    }`
  )
  if (response) {
    watchables.value = checkWatchlist(response)
  }
})

const load = async () => {
  if (watchables.value.totalItems > watchables.value.items.length) {
    //if (page.value < 3) {
    page.value++
    const response = await getData();
    if (response) {
      watchables.value.items = [...watchables.value.items, ...response.items]
      watchables.value.size = watchables.value.size + response.size
    }
  }
}

const getData = async () => {
  return await APIHandler.get(
      `watchable?page=${page.value}&size=${size.value}&sort=${sort.value}${
          filter.value ? `&filter=${filter.value}` : ''
      }`
  )
}

const captureFilters = (filters: IFilters) => {
    sort.value = filters.sort
    let filterValue = '';
    if (filters.filter) {
      const preFilter = props.filter_base ? `type:eq:${props.filter_base}` + '&' : ''
      filterValue = preFilter + Object.entries(filters.filter)
          .filter(([key, value]) => {
            if (!value)
              return false

            const dataSplitted: any[] = value.split(':')
            if (typeof dataSplitted[1] === 'object')
              return dataSplitted[1].length !== 0
            return dataSplitted[1] !== 'undefined' && dataSplitted[1] !== '' && dataSplitted[1] !== ':in'
          })
          .map(([key, value]) => {
            if (key === 'keyword') {
              const keywordSplitted = value.split(',')
              return keywordSplitted.map(keyword => `name:like:${keyword}`).join('&filter=')
            }
            //return key === 'genres.id' || key === 'provider.id' ? `${key}:in:${value}` : `${key}:${value}`
            return `${key}:${value}`
          })
          .join('&filter=')
    }

    if (filterValue !== '') {
      filter.value = filterValue
    } else {
      filter.value = props.filter_base ? `type:eq:${props.filter_base}` : undefined
    }
  /*} else {
    filter.value = props.filter_base ? `type:eq:${props.filter_base}` : undefined
  }*/
}

watch(() => filter.value, async (newValue) => {
  const response = await getData();

  if (response) {
    watchables.value = response
  }
})

watch(() => sort.value, async (newValue) => {
  const response = await getData();

  if (response) {
    watchables.value = response
  }
})

watch(
  () => route.fullPath,
  (newVal, oldValue) => {
    if (newVal !== oldValue) router.push(newVal)
  }
)

const checkWatchlist = (watchables: { items: IWatchable[]; totalItems: number; page: number; size: number }) => {
  if (!watchlistStore.watchlist || watchlistStore.watchlist.length === 0) return watchables;
  watchables.items.map(watchable => watchable.inWatchlist = watchlistStore.watchlist.some(item => item.watchable_id === watchable.id))

  return watchables;
}
</script>

<style scoped>
.infinite-height {
  height: 100vh;
  -ms-overflow-style: none;
}
.infinite-height::-webkit-scrollbar {
  display: none;
}
</style>
