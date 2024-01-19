import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useCookies } from 'vue3-cookies'
import { useUserStore } from '@/stores/user'
import * as APIHandler from '@/lib/APIHandler'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/films',
      name: 'films',
      component: () => import('../views/MovieList.vue')
    },
    {
      path: '/series',
      name: 'series',
      component: () => import('../views/TvList.vue')
    },
    {
      path: '/populars',
      name: 'populars',
      component: () => import('../views/PopularsList.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/watchable/:id',
      name: 'watchableDetail',
      props: true,
      component: () => import('../views/WatchableDetail.vue')
    },
    {
      path: '/login',
      name: 'loginPage',
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/admin',
      name: 'adminPage',
      component: () => import('../views/AdminPage.vue')
    }
  ]
})

//TODO: Add auth guard and configure non public routes

const { cookies } = useCookies()

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  let isAuthenticated = cookies.get('access_token')
  const refreshToken = cookies.get('refresh_token')
  if (!isAuthenticated) {
    if (refreshToken) {
      await APIHandler.refreshToken()
      isAuthenticated = cookies.get('access_token')
    } else {
      userStore.setUser(undefined)
    }
  }

  if (to.name === 'adminPage') {
    if (!isAuthenticated) {
      next({ name: 'loginPage' })
    }
    if (userStore.user.role !== 'admin') {
      next({ name: from.name })
    }
    next()
  } else next()
})

export default router
