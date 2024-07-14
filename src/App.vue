<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { useRoute } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import {onBeforeMount, ref} from 'vue'
import { useUserStore } from "@/stores/user";
import {useMaintenanceStore} from "@/stores/maintenance"
import * as APIHandler from '@/lib/APIHandler'

const route = useRoute()
const userStore = useUserStore()
const maintenanceStore = useMaintenanceStore()

const handleReload = ref<number>(0);
const contentReload = ref<number>(0);

const captureChange = () => {
  handleReload.value += 1
}

const handleContentReload = () => {
  contentReload.value += 1
}

onBeforeMount(async () => {
  const response = await APIHandler.isMaintenance()
  maintenanceStore.setMaintenance(response)
})
</script>

<template>
  <main v-if="route.fullPath === '/login' || route.name === 'changePassword'">
    <LoginPage />
  </main>
  <el-container v-else class="container mx-auto min-h-fit">
    <el-header>
      <NavBar v-if="!maintenanceStore.maintenance || (userStore.user?.role == 'admin' && maintenanceStore?.maintenance)" :key="handleReload" @reload-key="handleContentReload"/>
    </el-header>
    <el-main :key="contentReload">
      <RouterView @reload="captureChange" />
    </el-main>
  </el-container>
</template>

<style scoped>
/*header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}*/
</style>
