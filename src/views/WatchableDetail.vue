<template>
  <el-card>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-image :src="image_url" class="w-full image" fit="cover" lazy />
      </el-col>
      <el-col :span="16">
        <h1>{{ watchable.name }} {{ watchable.release_date.split('-')[0] }}</h1>
        <p>{{ watchable.overview }}</p>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue'
import * as APIHandler from '@/lib/APIHandler'
import type { IWatchable } from '@/lib/types/customTypes'
import { useRoute } from 'vue-router'
import { useContentStore } from '@/stores/content'

const route = useRoute()
const store = useContentStore()

const watchable = ref<IWatchable>(store.watchable)
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
})

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
  background: #2c3e50;
  color: #fff;
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
</style>
