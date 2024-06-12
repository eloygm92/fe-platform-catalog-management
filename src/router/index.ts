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
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/films',
      name: 'films',
      component: () => import('../views/MovieList.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/series',
      name: 'series',
      component: () => import('../views/TvList.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/populars',
      name: 'populars',
      component: () => import('../views/PopularsList.vue'),
      meta: { requiresAuth: false }
    },
    /*{
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }
    },*/
    {
      path: '/watchable/:id',
      name: 'watchableDetail',
      props: true,
      component: () => import('../views/WatchableDetail.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'loginPage',
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/admin',
      name: 'adminPage',
      component: () => import('../views/AdminPage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/profile',
      name: 'profilePage',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/watchlist',
      name: 'watchlistPage',
      component: () => import('../views/WatchlistView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/change-password',
      name: 'changePassword',
      component: () => import('../views/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/maintenance',
      name: 'maintenance',
      component: () => import('../views/MaintenanceView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

const { cookies } = useCookies()

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const watchlistStore = useWatchlistStore()

  let isAuthenticated = cookies.get('access_token')
  const refreshToken = cookies.get('refresh_token')
  const isMaintenance = await APIHandler.isMaintenance();

  if (isMaintenance && to.name != 'maintenance') {
    if (to.name === 'loginPage' || to.name === 'changePassword') next()
    else if (userStore.user?.role !== 'admin') next({name: 'maintenance'})
  }

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

  if (to.meta.requiresAuth && isAuthenticated) {
    if (to.meta.requiresAdmin && userStore.user?.role !== 'admin') {
      next({ name: from.name?.toString() })
    }
    if (to.name === 'loginPage' || to.name === 'changePassword') {
      next({ name: 'home' })
    }
    next()
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'loginPage' })
  } else next()

})

export default router
