import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
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
    }
  ]
})

//TODO: Add auth guard and configure non public routes

export default router
