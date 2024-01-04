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
    <div class="player-list" v-for="(player, index) in this.players" :key="index">
        {{ player.name }}
    </div>
    </div>
    <div class="center">
    <div class="wrap">
      <div class="wrap1" style="grid-area: a;">
        <button v-on:click="endGame" class="back">{{ uiLabels["cancel"] }}</button>
      </div>
      <div class="wrap2" style="grid-area: b;">
        <button v-if="this.isHost" v-on:click="startGame" class="button">{{ uiLabels["start"] }}</button>
      </div>
      </div>
    </div>

    <div class="custom-alert" v-if="this.showAlert">
        <div class="alert-content">
          {{uiLabels["hostEndedGame"]}} 
          <br><br>
        <button class="closeButton" @click="closeAlert">{{uiLabels["closePopUp"]}}</button>
      </div>
    </div>
</template>
<script>

import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

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
    isHost: false, 
    showAlert: false 
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
    console.log(this.players)
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
    if (!this.isHost) {
      this.showAlert = true; 
    }
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
    socket.emit('lockGame', this.gameCode)
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
  },
  closeAlert(){
      this.showAlert = false;
      this.$router.push('/')
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

.center {
  grid-template-columns: auto auto;
  display:grid; 
  justify-content: center;
}

.wrap {
  padding-top: 50px;
  display: grid;
  grid-template-areas: 'a b';
  width: 440px;
  place-items: center;
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
  width: 220px;
  border-radius: 40px; 
  border: 0.1875em solid #2a9451;
  padding: 10px;
  margin:0px auto;
  color: rgb(54, 54, 54);
  text-align: center;
  background-color: #81b8ce;
  font-weight: bold;
  font-size: 25px;
  font-family: monospace;
  color: yellow;
}

#gameCode {
  width: 16vw; /* Adjusted width to 8% of viewport width */
  height: 3vh; /* Adjusted height to 3% of viewport height */
  border-radius: 3.125em;
  background-color: #81b8ce;
  border: 0.1875em solid yellow;
  color:rgb(54, 54, 54);
  font-size: 6vw;
  font-family: monospace;
  text-align: center;
  text-decoration: none;
  margin: 7vh auto;
  padding: 6vw; /* Adjusted padding to 1.25% of viewport width */
  display: flex;
  justify-content: center;
  align-items: center;
}
.button{
  position: absolute;
  right: 50px;
  bottom: 50px;
}
.back{
  position: absolute;
  left: 50px;
  bottom: 50px;
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
#gameCode {
  width: 40vw; /* Adjusted width to 8% of viewport width */
  height: 3vh; /* Adjusted height to 3% of viewport height */
  font-size: 8vw;
}

.wrap {
  padding-top: 300px;
  display: grid;
  grid-template-areas: 'a b';
  width: 90vw;
  place-items: center;
}

.wrap1 {
  grid-area: a;
}

.wrap2 {
  grid-area: b;
  display: flex;
  gap: 20px;
}

.player-list{
  display: flex;
  justify-content: center;
  align-items: center;
  width:min-content;
  padding: 10px;
  margin:0px auto;
  width: 220px;
}
}
</style>