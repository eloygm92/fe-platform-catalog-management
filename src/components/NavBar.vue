<template>
  <el-menu mode="horizontal" @select="handleSelect" class="justify-start">
    <el-menu-item v-for="item in menu" :key="item.index" :index="item.index">
      {{ item.title }}
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const menu = ref([
  {
    index: '1',
    title: 'Home',
    path: '/'
  },
  {
    index: '2',
    title: 'About',
    path: '/about'
  },
  {
    index: '3',
    title: 'Contact',
    path: '/contact'
  }
])

const handleSelect = (key: string) => {
  router.push(menu.value[Number(key) - 1].path)
}
</script>

<style scoped></style>
