<template>
  <el-dialog
    title="Temporadas y Capítulos"
    v-model="dialogVisible"
    width="65%"
    destroy-on-close
    @close="handleButtonClick"
    custom-class="overflow-x-auto"
  >
    <el-table
      :data="seasonList"
      row-key="id"
      stripe
      height="500px"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-table :data="row.episodes" >
            <el-table-column prop="episode_number" width="40px" />
            <el-table-column prop="name" label="Nombre" width="200px" >
              <template #default="{ row, column, $index }">
                <span class="unbrake-word">{{ row[column.property] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="overview" label="Descripción" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="poster_path" label="Poster" width="100px">
        <template #default="{ row }">
          <el-image v-if="row.poster_path" :src="calculateSeasonImage(row.poster_path)" class="w-18 h-20" :alt="'Poster de la temporada' + row.season_number" :fit="'scale-down'"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Nombre" width="120px" />
      <el-table-column prop="overview" label="Descripción" min-width="200px"/>
    </el-table>
  </el-dialog>
<!--  <button type="button" @click="handleButtonClick" class="relative bg-white text-black adapt-poster rounded-b z-40 ">Ver Temporadas</button>-->
  <div class="grid">
  <button type="button" @click="handleButtonClick" class="relative font-bold bg-gray-950 adapt-poster rounded-b z-40 py-1.5">Ver Temporadas</button>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import * as APIHandler from "@/lib/APIHandler";
import type {ISeason} from "@/lib/types/customTypes";

const props = defineProps({
  watchable_id: {
    type: Number,
    required: true
  },
})

const seasonList = ref<ISeason[]>([])
const dialogVisible = ref<boolean>(false)

onBeforeMount(async () => {
  const response = await APIHandler.get(`season/watchable/${props.watchable_id}`)
  if (response) {
    seasonList.value = response
  }
})

const calculateSeasonImage = (url: string | undefined) => {
  return url ? import.meta.env.VITE_IMG_CDN + 'w185' + url : import.meta.env.VITE_404_IMG
}

const handleButtonClick = () => {
  dialogVisible.value = !dialogVisible.value
}
</script>

<style scoped>
.unbrake-word {
  word-break: break-word;
}
.adapt-poster {
  max-width: 18.75rem;
}
</style>