<template>
  <div class="flex">
    <div class="w-fit">
      <FiltersWatchable @filter-change="captureFilters" />
    </div>
    <div
      v-infinite-scroll="load"
      infinite-scroll-immediate="false"
      class="flex justify-start flex-wrap overflow-auto infinite-height"
    >
      <WatchableGrid
        v-if="watchables.items?.length"
        v-for="watchable in watchables.items"
        :key="watchable.id"
        :watchable="watchable"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import * as APIHandler from '@/lib/APIHandler'
import WatchableGrid from '@/components/WatchableGrid.vue'
import FiltersWatchable from '@/components/FiltersWatchable.vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  filter_base: {
    type: String,
    required: false
  }
})

const route = useRoute()
const router = useRouter()

const sort = ref<string>('popularity:desc')
const page = ref<number>(1)
const size = ref<number>(24)
const filter = ref<string>(props.filter_base ? `type:eq:${props.filter_base}` : undefined)
const watchables = ref<{ items: object[]; totalItems: number; page: number; size: number }>({
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
    watchables.value = response
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

const captureFilters = (filters: object) => {
    sort.value = filters.sort
    let filterValue = '';
    if (filters.filter) {
      const preFilter = filters.value ? filters.value + '&' : ''
      filterValue = preFilter + Object.entries(filters.filter)
          .filter(([key, value]) => {
            console.log(key, value)
            if (!value)
              return false

            const dataSplitted = value.split(':')
            if (typeof dataSplitted[1] === 'object')
              return dataSplitted[1].length !== 0
            return dataSplitted[1] !== 'undefined' && dataSplitted[1] !== ''
          })
          .map(([key, value]) => {
            if (key === 'keyword') {
              const keywordSplitted = value.split(',')
              return keywordSplitted.map(keyword => `name:like:${keyword}`).join('&filter=')
            }
            return key === 'genres.id' || key === 'provider.id' ? `${key}:in:${value}` : `${key}:${value}`
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
