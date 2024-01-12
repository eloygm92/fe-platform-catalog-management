<template>
  <el-menu mode="horizontal" @select="handleSelect" class="justify-start" :ellipsis="false">
    <el-menu-item v-for="item in menu" :key="item.index" :index="item.index">
      {{ item.title }}
    </el-menu-item>
    <div class="flex-grow-personal" />
    <el-menu-item :index="dataLogin.index">
      {{ dataLogin.title }}
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

const router = useRouter()
const { cookies } = useCookies()

const menu = ref([
  {
    index: '1',
    title: 'Inicio',
    path: '/'
  },
  {
    index: '2',
    title: 'Populares',
    path: '/populars'
  },
  {
    index: '3',
    title: 'Películas',
    path: '/films'
  },
  {
    index: '4',
    title: 'Series',
    path: '/series'
  }
])

const dataLogin = reactive({
  index: (menu.value.length + 1).toString(),
  title: cookies.get('access_token') ? 'Logout' : 'Login',
  path: cookies.get('access_token') ? '/logout' : '/login'
})

const handleSelect = (key: string) => {
  if (Number(key) < menu.value.length + 1) router.push(menu.value[Number(key) - 1].path)
  else router.push(dataLogin.path)
}
</script>

<style scoped>
.flex-grow-personal {
  flex-grow: 1;
}
</style>
