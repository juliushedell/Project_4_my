import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
      {
      path: '/poll/:id',
      name: 'PollView',
      component: () => import('../views/PollView.vue')
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultView',
      component: () => import('../views/ResultView.vue')
    }, 
    {
      path: '/about/',
      name: 'HowToPlayView',
      component: () => import('../views/HowToPlayView.vue')
    },
    {
      path: '/hostgame/',
      name: 'HostGameView',
      component: () => import('../views/HostGameView.vue')
    },
    {
      path: '/back/',
      name: 'StartView',
      component: () => import('../views/StartView.vue')
    },
    // {
    //   path: '/backk/',
    //   name: 'HostGameView',
    //   component: () => import('../views/HostGameView.vue')
    // },
    {
      path: '/createtheme/',
      name: 'CreateTheme',
      component: () => import('../views/CreateThemeView.vue')
    },
  ]
})

export default router
