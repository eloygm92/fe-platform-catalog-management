<template>
  <el-table
    :data="watchables"
    style="width: 100%;"
    v-loading="load"
  >
    <el-table-column
      prop="watchable.name"
      label="Nombre"
    />
    <el-table-column
      label="Visto"
      prop="view"
    >
      <template #default="scope">
        <el-switch
          v-model="scope.row.view"
          @change="handleChange(scope.row.view,scope.row.id)"
          active-text="Sí"
          inactive-text="No"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue'
import * as APIHandler from "@/lib/APIHandler";
import {useUserStore} from "@/stores/user";

const load = ref<boolean>(false);
const watchables = ref<object[]>([])

const userStore = useUserStore()

onBeforeMount(async () => {
  load.value = true;
  await getData();
  load.value = false;
})

const handleChange = async (val: boolean | string | number, id: any) => {
  const response = await APIHandler.patch('watchlist/' + id, {view: val})
  if (response.ok) {
    await getData()
  }
}

const getData = async () => {
  const response = await APIHandler.get('watchlist/' + userStore.user?.id)
  if (response) {
    watchables.value = response
  }
}

</script>

<style scoped>

</style>