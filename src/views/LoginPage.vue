<template>
  <div
    class="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-700 to-purple-800"
  >
    <div class="max-w-full mx-auto">
      <div
        class="bg-white shadow-md border border-gray-200 rounded-lg max-w-md p-4 sm:p-6 lg:p-8 max-height overflow-auto dark:bg-gray-800 dark:border-gray-700"
      >
        <form v-if="!visibleRegister" class="space-y-6" @submit.prevent>
          <h3 class="text-xl font-medium text-gray-900 dark:text-white">
            Inicia sesión en la plataforma
          </h3>
          <div>
            <span v-if="error" class="text-red-600 text-xs">
              La combinación usuario/contraseña no es correcta
            </span>
            <label
              for="username"
              class="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
            >
              Introduce tu nombre de usuario
            </label>
            <input
              :key="reload"
              type="username"
              name="username"
              v-model="username"
              id="username"
              placeholder="usuario"
              :class="inputClass"
              required="false"
            />
          </div>
          <div>
            <label
              for="password"
              class="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input
              :key="reload"
              type="password"
              name="password"
              v-model="password"
              id="password"
              placeholder="••••••••"
              :class="inputClass"
              required="false"
            />
          </div>
          <!--<div class="flex items-start">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  type="checkbox"
                  class="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                >
              </div>
              <div class="text-sm ml-3">
                <label
                  for="remember"
                  class="font-medium text-gray-900 dark:text-gray-300"
                >
                  Recuerdame
                </label>
              </div>
            </div>
          </div>-->
          <button
            type="submit"
            @click="loginButton()"
            class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Inicia Sesion
          </button>
        </form>
        <el-divider v-if="!visibleRegister" content-position="left"
          >¿Todavía no estas registrado?</el-divider
        >
        <el-divider v-else content-position="center">¿Estas registrado?</el-divider>
        <el-button
          v-if="visibleRegister"
          link
          type="primary"
          class="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mb-2"
          @click="updateVisibleRegister"
          >Inicia Sesión</el-button
        >
        <el-button
          v-if="!visibleRegister"
          link
          type="primary"
          class="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          @click="updateVisibleRegister"
        >
          Registrate
        </el-button>
        <UserForm v-else @created="createdUser" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCookies } from 'vue3-cookies'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import UserForm from '@/components/UserForm.vue'
import getWatchlist from "@/lib/watchlistData";

const { cookies } = useCookies()
const router = useRouter()
const userStore = useUserStore()

const password = ref<string | undefined>(undefined)
const username = ref<string | undefined>(undefined)
const error = ref<boolean>(false)
const reload = ref<number>(0)
const inputClass = ref<string>(
  'bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
)
const visibleRegister = ref<boolean>(false)

const loginButton = () => {
  fetch(import.meta.env.VITE_API + 'auth/signin/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
    .then((response) => {
      if (response.status === 201) return response.json()
      else throw new ErrorEvent('loginError')
    })
    .then((data) => {
      userStore.setUser(data)
    })
    .catch((e) => {
      if (e instanceof ErrorEvent) {
        error.value = true
        reload.value++
      }
    })
    .finally(() => {
      if (cookies.get('access_token')) {
        getWatchlist()
        if (window.history.length > 0) router.back()
        else router.push({ name: 'home' })
      }
    })
}

watch(
  () => error.value,
  (newValue) => {
    if (newValue) {
      inputClass.value += ' border-red-600 bounce'
    }
  }
)

const updateVisibleRegister = () => {
  visibleRegister.value = !visibleRegister.value
}

const createdUser = () => {
  if (cookies.get('access_token')) {
    if (window.history.length > 0) router.back()
    else router.push({ name: 'home' })
  }
}
</script>

<style scoped>
.max-height {
  max-height: 80vh;
  -ms-overflow-style: none;
}

.max-height::-webkit-scrollbar {
  display: none;
}

.bounce {
  outline: 0;
  animation-name: bounce;
  animation-duration: 0.5s;
}

@keyframes bounce {
  0% {
    transform: translateX(0px);
    timing-function: ease-in;
  }
  37% {
    transform: translateX(5px);
    timing-function: ease-out;
  }
  55% {
    transform: translateX(-5px);
    timing-function: ease-in;
  }
  73% {
    transform: translateX(4px);
    timing-function: ease-out;
  }
  82% {
    transform: translateX(-4px);
    timing-function: ease-in;
  }
  91% {
    transform: translateX(2px);
    timing-function: ease-out;
  }
  96% {
    transform: translateX(-2px);
    timing-function: ease-in;
  }
  100% {
    transform: translateX(0px);
    timing-function: ease-in;
  }
}
</style>
