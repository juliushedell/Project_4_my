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
      path: '/Lobby/:gameCode/:name/:isHost',
      name: 'Lobby',
      component: () => import('../views/Lobby.vue'),
      props: true
    },
    {
      path: '/playingGame/:gameCode/:name/:isHost',
      name: 'playingGame',
      component: () => import('../views/playingGame.vue')
    },
    {
      path: '/Lobbytwo/:gameCode/:name/:isHost',
      name: 'Lobbytwo',
      component: () => import('../views/LobbytwoView.vue')
    }, 
    {
      path: '/Podium/:gameCode/:name/:isHost', 
      name: 'Podium',
      component: () => import('../views/Podium.vue')
    },
    {
      path: '/Final/', 
      name: 'final',
      component: () => import('../views/Final.vue')
    },
    {
      path: '/Confetti/', 
      name: 'Confetti',
      component: () => import('../components/Confetti.vue')
    }
  ] 
})

export default router

