<template>
  <el-menu @select="handleSelect" :default-active="defaultActive">
    <el-menu-item v-for="item in menu" :index="item.index" :key="item.index">
      {{ item.title }}
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emits = defineEmits(['update-vision'])
const props = defineProps({
  defaultItem: {
    type: String,
    required: true
  }
})
const defaultActive = ref<string>(props.defaultItem)

const menu = ref<object[]>([
  {
    index: '1',
    title: 'Películas',
    keyTable: 'watchable/movies'
  },
  {
    index: '2',
    title: 'Series',
    keyTable: 'watchable/series'
  },
  {
    index: '3',
    title: 'Usuarios',
    keyTable: 'user'
  }
])

const handleSelect = (key: string) => {
  const foundObject = menu.value.find((item) => item.index === key)
  emits('update-vision', { keyTable: foundObject.keyTable, index: foundObject.index })
}
</script>

<style scoped></style>
