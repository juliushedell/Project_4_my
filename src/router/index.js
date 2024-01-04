import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import JoinGameCode from '../views/JoinGameCode.vue'
import CreateView from '../views/CreateView.vue'
import JoinGameName from '../views/JoinGameName.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: CreateView
    },
    {
      path: '/HowToPlayView/',
      name: 'HowToPlayView',
      component: () => import('../views/HowToPlayView.vue')
    },
    {
      path: '/JoinGameName/:gameCode',
      name: 'JoinGameName',
      component: JoinGameName
    },
    {
      path: '/JoinGameCode/',
      name: 'JoinGameCode',
      component: JoinGameCode
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
      path: '/Final/:gameCode/:name/:isHost', 
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

