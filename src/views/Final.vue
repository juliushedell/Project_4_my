<template>
  <div class="confetti-wrapper">
  <Confetti />
  <div class="content">
    <div class="header">
      <p>PODIUM</p>
    </div>

    
    <div class="row-container">
    <img src="../../public/img/gifAlligator.gif" alt="Alligator GIF" id="alligatorGifLeft" >
  
    <div class=podiumFrame>
      <div class="placement" v-for="(i, index) in theScoreboard" :key="i" >
            <template v-if="typeof i !=='undefined' && i.length > 0 ">
              <div :class="{'placementNr': index === 0, 'silver': index === 1, 'bronze': index === 2}">{{ index + 1 }}</div>
              <div id="points">{{uiLabels['points']}} {{ i[0].points }}</div>
              <div v-for="j in i" :key="j">
                <template v-if="(typeof j !=='undefined')">
                <div id ="name">{{ j.name }} </div>
                </template>
              </div>
            </template>
        </div>
  </div>
    <img src="../../public/img/gifAlligator.gif" alt="Alligator GIF" id="alligatorGifRigth">
  </div>

<div class="quitGame">

  <router-link to= "/" class="button" > {{ uiLabels["endGame"] }} </router-link>
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
  conf:[],
  poll: {},
  gameCode: 0,
  players: {}, 
  isInputDisabled: false, 
  name: '',
  isHost: false,
  playerList: [],
  currentPlayer: {},
  theScoreboard: []
}
},

created: function () {
  this.gameCode = this.$route.params.gameCode
  socket.emit("pageLoaded", this.lang);
  socket.emit('compareAnswer', this.gameCode);
  socket.on('scoreBoard', (theScoreboard) => {
    console.log(theScoreboard) 
    this.theScoreboard = theScoreboard
  });
  
  socket.emit("getScoreboard", this.gameCode);
  socket.on("init", (labels) => {
    this.uiLabels = labels
  });
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
}
}}
</script>

<style scoped>

.content {
  color: green;
  font-size: 28px;
  font-family: monospace;
  text-align: center; 
  font-weight: bald;
}

.row-container {
  display: flex; 
  justify-content: space-between;
  align-items: center; 
}

#alligatorGifLeft{
  transform: scaleX(-1);
  width: 25%;
  height: 25%; 
}

#alligatorGifRigth{
  width: 25%;
  height: 25%; 
}

.podiumFrame {
  border: 4px solid green;
  padding: 2vw; 
  display: flex;
  flex-direction: column; 
  align-items: center; 
  width: 40vw; 
  min-height: 40vh; 
  resize: none;
  overflow-wrap: break-word;
  margin: 0 auto;
  margin-top: 4vh; 
  font-family: monospace;
 font-size: 20px;
  text-align: center;
}


.placement {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column; 
  align-items: center; 
  text-align: center; 
}

.placementNr {
  width: 50px;
  height: 50px;
  border: 4px solid goldenrod;
  border-style: double;
  color:black;
  border-radius: 50%;
  background-color: rgb(255, 215, 0);
  text-align: center;
  line-height: 50px; /* Vertically center content within the circle */
  margin-bottom: 5px; /* Adjust spacing between elements */
}

.silver {
  width: 50px;
  height: 50px;
  border: 4px solid rgb(161, 160, 160);
  border-style: double;
  border-radius: 50%;
  background-color: rgb(192,192,192);
  text-align: center;
  line-height: 50px; /* Vertically center content within the circle */
  margin-bottom: 5px; /* Adjust spacing between elements */
}

.bronze {
  width: 50px;
  height: 50px;
  border: 4px solid rgb(174, 100, 26);
  border-style: double;
  border-radius: 50%;
  background-color: rgb(205, 127, 50);
  text-align: center;
  line-height: 50px; /* Vertically center content within the circle */
  margin-bottom: 5px; /* Adjust spacing between elements */
}


li {
list-style: none;
background: url('/img/Bullet_points.png') no-repeat 0 center;
background-size: 1.5em;
padding-left: 50px;
margin-bottom: 30px;
text-align: left;
font-size: 1.5em;
font-family: monospace;
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
.quitGame{
  position: fixed;
    bottom: 2vh; 
    right: 2vw; 
    font-size: 22px;
    color: yellow;
    font-family: monospace;
}

.button {
  height: 20px;
}

#name{
  color:black;
}


@media screen and (max-width:50em) {
.podiumFrame{
  padding-top: 4vh;
  font-size: 22px; 
  height: 30vh;
}}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  .placementNr {
    font-size: 22px;
  }

.podiumFrame {
  width: 60vw; 
  font-size: 16px; 
  height: 45vh;
}

  .row-container {
    flex-direction: column; /* Switch to a column layout */
    align-items: stretch; /* Adjust alignment for column layout if needed */
    align-items: center; 
  }

  #alligatorGifRigth{
    margin-top: 20px;

  }
  .button {
  height: 30px;
}}

</style>