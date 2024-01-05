<template>
  <div class="confetti-wrapper">
    <Confetti />
  </div>
  <header>
    <h1>
       Podium 
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>
  <div class="content">
    <div class="row-container">
      <img src="../../img/gifAlligator.gif" alt="Alligator GIF" id="alligatorGifLeft">
      <div class=podiumFrame>
        <div class="placement" v-for="(i, index) in theScoreboard" :key="i">
          <template v-if="typeof i !== 'undefined' && i.length > 0">
            <div :class="{ 'placementNr': index === 0, 'silver': index === 1, 'bronze': index === 2 }">{{ index + 1 }}</div>
            <div id="points">{{ uiLabels['points'] }} {{ i[0].points }}</div>
            <div v-for="j in i" :key="j">
              <template v-if="(typeof j !== 'undefined')">
                <div id="name">{{ j.name }} </div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <img src="../../img/gifAlligator.gif" alt="Alligator GIF" id="alligatorGifRigth">
    </div>
    <div class="quitGame">
      <router-link to="/" class="button"> {{ uiLabels["endGame"] }} 
        <span class="tooltiptext">See ya later, allegator!</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import Confetti from "@/components/Confetti.vue";
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'Final',
  components: {
    Confetti,
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      conf: [],
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
}
</script>

<style scoped>
.confetti-wrapper {
  position: fixed;
  top: 0;
  left: 0;
}
.content {
  color: green;
  font-size: 28px;
  font-family: monospace;
  text-align: center;
}

.row-container {
  display: flex;
  align-items: center;
}

#alligatorGifLeft {
  transform: scaleX(-1);
  width: 25%;
  height: 25%;
}
.podiumFrame {
  border: 8px double green;
  padding: 2vw;
  display: flex;
  flex-direction: column;
  width: 40vw;
  min-height: 40vh;
  overflow-wrap: break-word;
  margin: 0 auto;
  margin-top: 10vh;
  font-family: monospace;
  font-size: 20px;
}
.placement {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
}
.placementNr {
  width: 50px;
  height: 50px;
  border: 4px solid goldenrod;
  border-style: double;
  color: black;
  border-radius: 50%;
  background-color: rgb(255, 215, 0);
  line-height: 50px;
  margin-bottom: 5px;
}

#name {
  color: black;
}

#alligatorGifRigth {
  width: 25%;
  height: 25%;
}
.silver {
  width: 50px;
  height: 50px;
  border: 4px solid rgb(161, 160, 160);
  border-style: double;
  border-radius: 50%;
  background-color: rgb(192, 192, 192);
  text-align: center;
  line-height: 50px;
  margin-bottom: 5px;
}
.bronze {
  width: 50px;
  height: 50px;
  border: 4px solid rgb(174, 100, 26);
  border-style: double;
  border-radius: 50%;
  background-color: rgb(205, 127, 50);
  text-align: center;
  line-height: 50px;
  margin-bottom: 5px;
}
.quitGame {
  padding-top: 120px;
  position: relative;
  bottom: 0.1vh;
  right: 0.1vw;
  font-size: 22px;
  color: yellow;
  font-family: monospace;
}
.tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.quitGame:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
.button {
  height: 20px;
  position: fixed;
  right: 3em;
  bottom: 3em;
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  .podiumFrame {
    border: 6px double green;
    width: 60vw;
    margin-top: 4vh;
  }
  .row-container {
    flex-direction: column;
    align-items: center;
  }

  #alligatorGifRigth {
    margin-top: 20px;
  }
  
  .quitGame {  
    position: fixed;
    bottom: 0px;
    display: flex; 
    align-items: center;
    padding: 30px;
    width: 85%;
    background-color: rgba(236, 236, 236, 0.3);
  }

  .quitGame .button {
    right: 30px;
    bottom: 10px;
    position: fixed;
  }
}
</style>