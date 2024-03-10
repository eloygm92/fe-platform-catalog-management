<template>
  <el-menu
    mode="horizontal"
    @select="handleSelect"
    class="justify-start"
    :ellipsis="false"
    :key="reload"
  >
    <el-menu-item v-for="item in menu" :key="item.index" :index="item.index">
      {{ item.title }}
    </el-menu-item>
    <div class="flex-grow-personal" />
    <el-menu-item v-if="dataLogin.title === 'Login'" :index="dataLogin.index">
      {{ dataLogin.title }}
    </el-menu-item>
    <el-sub-menu v-else :index="dataLogin.index">
      <template #title><el-avatar :src="circleUrl" /></template>
      <el-menu-item :index="dataLogin.index + '-1'">Perfil</el-menu-item>
      <el-menu-item :index="dataLogin.index + '-2'">{{ dataLogin.title }}</el-menu-item>
      <el-menu-item v-if="userStore.user?.role === 'admin'" :index="dataLogin.index + '-3'"
        >Administrar</el-menu-item
      >
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import {ref, reactive, watch, onBeforeMount} from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'
import { useUserStore } from '@/stores/user'
import * as APIHandler from '@/lib/APIHandler'
import {useWatchlistStore} from "@/stores/watchlist";

const router = useRouter()
const { cookies } = useCookies()
const userStore = useUserStore()
const watchlistStore = useWatchlistStore()

const reload = ref<number>(0)
const circleUrl = ref<string>(import.meta.env.VITE_CIRCLE_AVATAR_IMG)

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
  index: (menu.value.length + 2).toString(),
  title: cookies.get('refresh_token') ? 'Logout' : 'Login',
  path: cookies.get('refresh_token') ? '/logout' : '/login'
})

const handleSelect = (key: string) => {
  if (Number(key) < menu.value.length + 1) router.push(menu.value[Number(key) - 1].path)
  else {
    if (dataLogin.title === 'Logout' && key === dataLogin.index + '-2') {
      if (!userStore.user?.id) removedUserData()

      APIHandler.logout(cookies.get('access_token')).then((response) => {
        if (response.status === 201) {
          removedUserData()
        }
      })
    } else if (key === dataLogin.index + '-1' && userStore.user?.id) router.push('/profile')
    else if (key === dataLogin.index + '-3' && userStore.user?.role === 'admin')
      router.push('/admin')
    else router.push(dataLogin.path)
  }
}

const removedUserData = () => {
  cookies.remove('access_token')
  cookies.remove('refresh_token')
  userStore.setUser(undefined)
  watchlistStore.setWatchlist(undefined)
  reload.value++
  router.push('/')
}

watch(
  () => userStore.user,
  (newValue) => {
    if (!newValue) {
      dataLogin.title = 'Login'
      dataLogin.path = '/login'
      menu.value = menu.value.filter((item) => item.index !== '5')
    } else {
      dataLogin.title = 'Logout'
      dataLogin.path = '/logout'
      menu.value.push({
        index: '5',
        title: 'Watchlist',
        path: '/watchlist'
      });
    }
  }
)

onBeforeMount(() => {
  if (userStore.user) {
    menu.value.push({
      index: '5',
      title: 'Watchlist',
      path: '/watchlist'
    })
  }
})
</script>

<style scoped>
.flex-grow-personal {
  flex-grow: 1;
}
</style>
