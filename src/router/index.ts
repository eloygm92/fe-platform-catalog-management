import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useCookies } from 'vue3-cookies'
import { useUserStore } from '@/stores/user'
import * as APIHandler from '@/lib/APIHandler'
import getWatchlist from "@/lib/watchlistData";
import {useWatchlistStore} from "@/stores/watchlist";

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
    },
    {
      path: '/profile',
      name: 'profilePage',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/watchlist',
      name: 'watchlistPage',
      component: () => import('../views/WatchlistView.vue')
    }
  ]
})

//TODO: Add auth guard and configure non public routes

const { cookies } = useCookies()

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const watchlistStore = useWatchlistStore()

  let isAuthenticated = cookies.get('access_token')
  const refreshToken = cookies.get('refresh_token')
  const developmentStatus = import.meta.env.VITE_DEVELOPMENT_STATUS !== 'false'
  if (developmentStatus && to.name !== 'loginPage' && !isAuthenticated && !refreshToken)
    next({ name: 'loginPage' })

  if (!isAuthenticated) {
    if (refreshToken) {
      await APIHandler.refreshToken()
      await getWatchlist()
      isAuthenticated = cookies.get('access_token')
    } else {
      userStore.setUser(undefined)
      watchlistStore.setWatchlist(undefined)
    }
  }

  if (to.name === 'adminPage') {
    if (!isAuthenticated) {
      next({ name: 'loginPage' })
    }
    if (userStore.user?.role !== 'admin') {
      next({ name: from.name?.toString() })
    }
    next()
  } else if (to.name === 'loginPage' && isAuthenticated) {
    next({ name: 'home' })
  } else next()
})

export default router
