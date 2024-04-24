<template>
  <div class="grid-cols-6 m-1">
    <el-input type="text" v-model="search_content" @keyup="doDelayedSearch" :prefix-icon="Search" placeholder="Buscar" clearable @clear="doDelayedSearch" class="col-span-2 rounded"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import { Search } from '@element-plus/icons-vue'

const emits = defineEmits(['search'])

const search_content= ref<string>('')
const timeout = ref<number | null>(null)

const doDelayedSearch = async () => {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }
  timeout.value = setTimeout(async () => {
    search_content.value === '' ? emits('search', null) : emits('search', search_content.value)
  }, 500)
}

</script>

<style scoped>

</style>