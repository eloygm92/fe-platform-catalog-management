<template>
 <div class="flex flex-wrap">
   <el-table v-if="data.length > 0" :data="data" class="ml-4">
     <el-table-column prop="name" label="Parametro" width="180" >
       <template #default="scope">
         <span class="unbroke-word">{{ mapperData[scope.row.name] }}</span>
        </template>
     </el-table-column>
     <el-table-column prop="value_status" label="Estado" width="180" >
       <template #default="scope">
         <el-switch
           v-model="scope.row.value_status"
           @change="handleChange(scope.row.value_status,scope.row.name)"
           :active-value="1"
           :inactive-value="0"
          />
       </template>
     </el-table-column>
   </el-table>
 </div>
</template>

<script setup lang="ts">

import {onBeforeMount,ref} from "vue";
import * as APIHandler from "@/lib/APIHandler";

const data = ref<{name: string, value: number}[]>([])
const mapperData = ref<Record<string, string>>({
  maintenance: 'Mantenimiento',
  load_news: 'Carga de elementos de forma generalizada',
  new_movies: 'Carga de películas',
  new_tvs: 'Carga de series',
  new_providers: 'Carga de proveedores',
})

onBeforeMount(async () => {
  await getData()
})

const handleChange = async (val: boolean | string | number, fieldName: any) => {
  const response = await APIHandler.patch(`config/${fieldName}/${val}`, {})
  if (response.ok) {
    await getData()
  }
}

const getData = async () => {
  const response = await APIHandler.get('config')
  if (response) {
    data.value = response
  }
}
</script>

<style scoped>
.unbroke-word {
  word-break: break-word;
}
</style>