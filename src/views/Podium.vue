<template>
    <header> 
        <h1>
            LEADERBOARD
            <img src="/img/Head_picture.png" class="head_picture">
        </h1>
    </header>
        <div class="answerDisplay">
        <h3>
            {{ uiLabels['answer'] }} **namn**
        </h3>
    </div>

    <div class=podiumFrame>
      <li class="player"> spelare 1 <span class="score">15 poäng</span></li>
      <li class="player"> spelare 1 <span class="score">15 poäng</span></li>
      <li class="player"> spelare 1 <span class="score">15 poäng</span></li>
    </div>

    <button v-on:click="nextAllegation" class="button">{{ uiLabels["nextQuestion"] }}</button>


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
    players: {}, 
  }
},
created: function () {
  this.gameCode = this.$route.params.gameCode
  this.name = this.$route.params.name
  this.isHost = this.$route.params.isHost;
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

  nextAllegation: function() {
    socket.emit("submitConfessions", {gameCode: this.gameCode, name: this.name, isHost: this.isHost});
    this.$router.push ('/playingGame/' + this.gameCode +'/' + this.name + '/' + this.isHost)
  }, 

 }}
</script>

<style>
.answerDisplay {
    color: green;
    font-family: 'Comic Sans MS';
    font-size: 22px;
    text-align: center; 
}

.podiumFrame {
  border: 4px solid green;
    padding: 2vw; 
    width: 80vw; 
    height: 40vh; 
    resize: none;
    overflow-wrap: break-word;
    margin: 0 auto;
    margin-top: 4vh; 
    font-family: 'Comic Sans MS';
    font-size: 2.0vw; 
}

.player {
   padding-left: 5vw;;
}

.score {
   padding-left: 40vw; 
}

li {
  list-style: none;
  background: url('/img/Bullet_points.png') no-repeat 0 center;
  background-size: 1.5em;
  padding-left: 50px;
  margin-bottom: 30px;
  text-align: left;
  font-size: 1.5em;
}

.button{
    position: fixed;
    bottom: 10vh; 
    right: 8vw; 
}


@media screen and (max-width:50em) {
  .podiumFrame{
    padding-top: 4vh;
    font-size: 2.8vw; 
    height: 30vh;
  }

  .player {
   padding-left: 10vw;;
}

.score {
   padding-left: 25vw; 
}



}


</style>