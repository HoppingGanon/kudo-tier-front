import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home/:id',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/MenuView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/AuthView.vue')
  },
  {
    path: '/tier/:tid',
    name: 'tier',
    component: () => import('../views/TierView.vue')
  },
  {
    path: '/regist',
    name: 'regist',
    component: () => import('../views/RegistrationView.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/TestView.vue')
  },
  {
    path: '/tier-settings',
    name: 'tier-settings-new',
    component: () => import('../views/TierSettingsView.vue')
  },
  {
    path: '/tier-settings/:tid',
    name: 'tier-settings',
    component: () => import('../views/TierSettingsView.vue')
  },
  {
    path: '/tier-search/:id',
    name: 'tier-search',
    component: () => import('../views/TierSearchView.vue')
  },
  {
    path: '/review/:rid',
    name: 'review',
    component: () => import('../views/ReviewView.vue')
  },
  {
    path: '/review-settings/:tid',
    name: 'review-settings-new',
    component: () => import('../views/ReviewSettingsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
