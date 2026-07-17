import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('../views/GamesView.vue')
  },
  {
    path: '/game/:id',
    name: 'GameDetail',
    component: () => import('../views/GameDetailView.vue'),
    props: true
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
