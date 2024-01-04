import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import JoinGameCode from '../views/JoinGameCode.vue'
import CreateView from '../views/CreateView.vue'
import JoinGameName from '../views/JoinGameName.vue'
import HowToPlayView from '../views/HowToPlayView.vue'
import Lobby from '../views/Lobby.vue'
import playingGame from '../views/playingGame.vue'
import LobbytwoView from '../views/LobbytwoView.vue'
import Podium from '../views/Podium.vue'
import Final from '../views/Final.vue'

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
      component: HowToPlayView
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
      component: Lobby,
      props: true
    },
    {
      path: '/playingGame/:gameCode/:name/:isHost',
      name: 'playingGame',
      component: playingGame
    },
    {
      path: '/Lobbytwo/:gameCode/:name/:isHost',
      name: 'Lobbytwo',
      component: LobbytwoView
    }, 
    {
      path: '/Podium/:gameCode/:name/:isHost', 
      name: 'Podium',
      component: Podium
    },
    {
      path: '/Final/:gameCode/:name/:isHost', 
      name: 'final',
      component: Final
    },
    {
      path: '/Confetti/', 
      name: 'Confetti',
      component: () => import('../components/Confetti.vue')
    }
  ] 
})

export default router

