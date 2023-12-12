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
      path: '/HowToPlayView/',
      name: 'HowToPlayView',
      component: () => import('../views/HowToPlayView.vue')
    },
    {
      path: '/HostGame/',
      name: 'HostGameView',
      component: () => import('../views/HostGameView.vue')
    },
    {
      path: '/EnterAllegations/',
      name: 'EnterAllegations',
      component: () => import('../views/EnterAllegations.vue')
    },
    {
      path: '/JoinGameName/:gameCode',
      name: 'JoinGameName',
      component: () => import('../views/JoinGameName.vue')
    },
    {
      path: '/JoinGameCode/',
      name: 'JoinGameCode',
      component: () => import('../views/JoinGameCode.vue')
    },
    {
      path: '/Lobby/:gameCode/:pid',
      name: 'Lobby',
      component: () => import('../views/Lobby.vue')
    },
    {
      path: '/HostGame/',
      name: 'HostGameView',
      component: () => import('../views/HostGameView.vue')
    },
    {
      path: '/createtheme/',
      name: 'CreateTheme',
      component: () => import('../views/CreateThemeView.vue')
    },
    {
      path: '/playingGame/',
      name: 'playingGame',
      component: () => import('../views/playingGame.vue')
    } 
  ] 
})

export default router

