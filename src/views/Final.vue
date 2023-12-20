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

    
    <div>
    <img src="../../public/img/gifAlligator.gif" alt="Alligator GIF" id="alligatorGif">
  
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

    <img src="../../public/img/gifAlligator.gif" alt="Alligator GIF" id="alligatorGif">


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
  
  socket.on('scoreBoard', (theScoreboard) => {
    console.log(theScoreboard) 
    this.theScoreboard = theScoreboard
  });

  socket.emit("getScoreboard", this.gameCode);
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

<style scoped>
.answerDisplay {
  color: green;
  font-family: 'Comic Sans MS';
  font-size: 22px;
  text-align: center; 
}

#alligatorGif{
  width: 25%;
  height: 25%; 
}

.podiumFrame {
  border: 4px solid green;
  padding: 2vw; 
  display: flex;
  flex-direction: column; /* Stack child elements vertically */
  align-items: center; /* Center child elements horizontally */
  width: 40vw; 
  min-height: 40vh; 
  resize: none;
  overflow-wrap: break-word;
  margin: 0 auto;
  margin-top: 4vh; 
  font-family: 'Comic Sans MS';
  font-size: 2.0vw; 
  text-align: center;
}

.placement {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column; /* Stack child elements vertically */
  align-items: center; /* Center child elements horizontally */
  text-align: center; /* Center text within each child element */
}

.placementNr {
  width: 50px;
  height: 50px;
  border: 2px solid goldenrod;
  border-radius: 50%;
  background-color: rgb(255, 215, 0);
  text-align: center;
  line-height: 50px; /* Vertically center content within the circle */
  margin-bottom: 5px; /* Adjust spacing between elements */
}

.silver {
  width: 50px;
  height: 50px;
  border: 2px solid rgb(161, 160, 160);
  border-radius: 50%;
  background-color: rgb(192,192,192);
  text-align: center;
  line-height: 50px; /* Vertically center content within the circle */
  margin-bottom: 5px; /* Adjust spacing between elements */
}

.bronze {
  width: 50px;
  height: 50px;
  border: 2px solid rgb(174, 100, 26);
  border-radius: 50%;
  background-color: rgb(205, 127, 50);
  text-align: center;
  line-height: 50px; /* Vertically center content within the circle */
  margin-bottom: 5px; /* Adjust spacing between elements */
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