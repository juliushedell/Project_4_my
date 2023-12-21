<template>
    <header> 
        <h1>
            Lobby
            <img src="/img/Head_picture.png" class="head_picture">
        </h1>
    </header>
    <div class="code">
        <h2 id="gameCode">
            {{ this.gameCode }}
        </h2>
    </div>
    <div class="playerLists">
    <div class="player-list" v-for="(player, index) in poll.players" :key="index">
        {{ player.name }}
    </div>
    </div>
    <div class="center">
    <div class="wrap">
      <div class="wrap1" style="grid-area: a;">
      </div>
      <div class="wrap2" style="grid-area: b;">
        <button v-on:click="endGame" class="back">{{ uiLabels["cancel"] }}</button>
        <button v-if="this.isHost" v-on:click="startGame" class="button">{{ uiLabels["start"] }}</button>
      </div>
      </div>
    </div>
</template>
<script>

import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
name: 'LobbytwoView',
components: {
  ResponsiveNav
},
data: function () {
  return {
    uiLabels: {},
    id: "",
    lang: localStorage.getItem("lang") || "en",
    hideNav: true,
    // lagrar confessions i array
    conf:[],
    poll: {},
    gameCode: 0,
    players: [], 
    name:'',
    isHost: false
  }
},
created: function () {
  this.gameCode = this.$route.params.gameCode
  this.name = this.$route.params.name
  this.isHost = this.$route.params.isHost === 'true';
  socket.emit("pageLoaded", this.lang);
  socket.emit("getPoll", this.gameCode);
  socket.emit("getPlayers", this.gameCode);
  socket.on("pullPlayer", (players) => {
    this.players = players
  })
  socket.on("pullPoll", (poll) => {
    this.poll = poll
  })
  socket.on("init", (labels) => {
    this.uiLabels = labels
  })
  socket.on("startGame", () => 
  this.$router.push ('/playingGame/' + this.gameCode +'/' + this.name + '/' + this.isHost)
  )
  socket.on('endTheGame', () => {
    this.$router.push('/')
  })
},
methods: {
  switchLanguage: function() {
    if (this.lang === "en") {
      this.lang = "sv"
    }
    else {
      this.lang = "en"
    }
    localStorage.setItem("lang", this.lang);
    socket.emit("switchLanguage", this.lang)
  },
  toggleNav: function () {
    this.hideNav = ! this.hideNav;
  },

  startGame: function() {
    socket.emit('countAllegations', this.gameCode)
    socket.emit("startPoll", this.gameCode)
    socket.emit('randomAllegation', this.gameCode)
    },

  endGame: function() {
    if (this.isHost) {
      socket.emit('endPoll', this.gameCode)
      this.$router.push('/')
    }
    else {
      socket.emit('removePlayer', {gameCode: this.gameCode, name: this.name})
      this.$router.push('/')
    }
  }
}}
</script>

<style scoped>

.playerLists {
  display: flex;
  flex-direction: row; 
  justify-content: center;
  align-items: center;
  flex-wrap: wrap; 
  gap: 20px;
}

/* .wrap{
  grid-template-columns:auto auto;
  display:grid; 
  justify-content: space-between;
  margin: 20px;
  justify-content: space-evenly;
  gap: 20px; 
} */
.center {
  display: flex;
  justify-content: center;
}

.wrap {
  justify-content: flex-start;
  padding-top: 50px;
  display: grid;
  grid-template-areas: 'a b';
  width: 440px;
}

.wrap1 {
  grid-area: a;
}

.wrap2 {
  grid-area: b;
  display: flex;
  gap: 130px;
}
.code{
    align-items: center;
    justify-content: center;
}

.player-list{
  display: flex;
  justify-content: center;
  align-items: center;
  width:min-content;
  height: 50px; 
  border-radius: 40px; 
  border: 3px solid rgb(54, 54, 54);
  padding: 10px;
  margin:0px auto;
  color: rgb(54, 54, 54);
  text-align: center;
  background-color: #81b8ce;
  font-weight: bold;
  font-size: 25px;
  width: 220px;
}

#gameCode {
  width: 16vw; /* Adjusted width to 8% of viewport width */
  height: 3vh; /* Adjusted height to 3% of viewport height */
  border-radius: 3.125em;
  background-color: #81b8ce;
  border: 0.1875em solid yellow;
  color:rgb(54, 54, 54);
  font-size: 6vw;
  text-align: center;
  text-decoration: none;
  margin: 7vh auto;
  padding: 6vw; /* Adjusted padding to 1.25% of viewport width */
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
#gameCode {
  width: 40vw; /* Adjusted width to 8% of viewport width */
  height: 3vh; /* Adjusted height to 3% of viewport height */
  font-size: 8vw;
}
}
</style>