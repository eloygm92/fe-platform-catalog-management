<template>
  <AdminMenu
    v-if="dataTypeSend !== ''"
    :default-item="defaultIndex"
    @update-vision="handleChange"
    class="w-32 float-left fixed left-0 h-screen"
  />
  <ConfigZone v-if="!loading && dataTypeSend == 'config'" />
  <AdminTable v-else-if="!loading" :data-type="dataTypeSend" />
  <div v-else v-loading.fullscreen.lock="loading" />
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import AdminMenu from '@/components/AdminMenu.vue'
import AdminTable from '@/components/AdminTable.vue'
import ConfigZone from '@/components/ConfigZone.vue'
import { useAdminTableStore } from '@/stores/admintable'

const dataTypeSend = ref<string>('')
const loading = ref<boolean>(false)
const defaultIndex = ref<string>('')
const adminTableStore = useAdminTableStore()
const handleChange = (dataType: {index: string, title: string, keyTable: string}) => {
  loading.value = true
  dataTypeSend.value = dataType.keyTable
  adminTableStore.setDataTypes(dataType.keyTable)
  adminTableStore.setIndexType(dataType.index)

  setTimeout(() => {
    loading.value = false
  }, 2000)
}

onBeforeMount(() => {
  if (adminTableStore.dataTypes !== '') {
    dataTypeSend.value = adminTableStore.dataTypes
    defaultIndex.value = adminTableStore.indexType
  } else {
    dataTypeSend.value = 'watchable/movies'
    defaultIndex.value = '1'
  }
})

/*watch(() => dataTypeSend.value, () => {
  ElLoading.service({fullscreen: true})
})*/
</script>

<style scoped></style>
