<template>
  <div class="confetti-wrapper">
    <Confetti />
  </div>
  <div class="content">
    <div class="header">
      <p>PODIUM</p>
    </div>
    <div class="row-container">
      <img src="../../public/img/gifAlligator.gif" alt="Alligator GIF" id="alligatorGifLeft">
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
      <img src="../../public/img/gifAlligator.gif" alt="Alligator GIF" id="alligatorGifRigth">
    </div>
    <div class="quitGame">
      <router-link to="/" class="button"> {{ uiLabels["endGame"] }} </router-link>
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

  methods: {
    switchLanguage: function () {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    }
  }
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
  margin-top: 4vh;
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
  position: fixed;
  bottom: 0.1vh;
  right: 0.1vw;
  font-size: 22px;
  color: yellow;
  font-family: monospace;
}

.button {
  height: 20px;
  position: absolute;
  right: 50px;
  bottom: 50px;
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {

  .podiumFrame {
    border: 6px double green;
    width: 60vw;
  }

  .row-container {
    flex-direction: column;
    align-items: center;
  }

  #alligatorGifRigth {
    margin-top: 20px;

  }

  .button {
    height: 30px;
  }
}</style>