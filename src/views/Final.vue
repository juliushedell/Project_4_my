<template>
  <div class="confetti-wrapper">
  <Confetti />
  <div class="content">
    <div class="header">
      <p>PODIUM</p>
    </div>
    <div class="answerDisplay">
      <h3>
        {{ uiLabels['theWinner'] }} {{ this.array1st }}
      </h3>
    </div>

    <div class="podiumFrame">
      <li class="player"> spelare 1 <span class="score">15 poäng</span></li>
      <li class="player"> spelare 1 <span class="score">15 poäng</span></li>
      <li class="player"> spelare 1 <span class="score">15 poäng</span></li>
    </div>
  </div>
  </div>
</template>

<script>

import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
import Confetti from "@/components/Confetti.vue";
const socket = io("localhost:3000");

export default {
name: 'Final',
components: {
ResponsiveNav,
Confetti,
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
  isInputDisabled: false //grundvariabel som gör att det går att redigera i iinput fieldsen
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

.confetti-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; 
}

canvas {
  display: block;
  width: 1500px;
  height: 800px;
  margin: auto;
}

.content {
  position: relative;
  z-index: 2; 
  margin-top: -700px;
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
.header {
  color: yellow;
  /* font-family: 'Comic Sans MS'; */
  font-size: 34px;
  text-align: center; 
  font-weight: bold;
}

</style>