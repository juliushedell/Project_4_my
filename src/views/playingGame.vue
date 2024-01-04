<template>
  <header>
    <h1>
      Game Time!
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>
  <div class="allNr">
    {{ this.allegationsLeft }}/{{ poll.totalAllegations }}
  </div>
  <div class=text-frame>
    <p>{{ poll.randomAllegation }}</p>
  </div>
  <div class="alligator-container">
    <img :style="{ clipPath: 'inset(0 ' + (110 - countPercentageAlligator) + '% 0 0)' }"
      src="../../img/alligatorTimer.png" alt="countDownAlligator" />
  </div>
  <div style="text-align: center;">
    <p v-if="timer > 0"> {{ timer }} </p>
    <p v-else="timer === 0"> {{ goToPodiumView() }} </p>
  </div>
  <div class="wrap">
    <div v-if="showSneakPeakButton">
      <button v-if="this.currentPlayer.sneakPeak && this.poll.lifeLine" v-on:click="sneakPeak" class="lifeline"> 
        Sneak Peak! 
      </button>
    </div>
    <div v-if="this.currentPlayer.visible" class="sneakpeak">
      {{ uiLabels['opponentAnswer'] }}
      <p v-for="(count, name) in this.sneakDict">
        {{ name }}: {{ count }}
      </p>
    </div>
    <div>
      <button v-if="this.currentPlayer.fiftyfifty && this.poll.lifeLine" v-on:click="implementFiftyFifty"
        class="lifeline"> 50/50 </button>
    </div>
  </div>
  <div class="playerLists">
    <div class="grid-container">
      <label v-for="(player, index) in randomizedPlayers" :key="index" class="grid-item">
        <input type="radio" :id="'player_' + index" :value="player" v-model="selectedPlayer" @change="submitAnswer"
          :disabled="this.currentPlayer.answerLock" class="custom-radio-input" />
        <span class="custom-radio-button">{{ player }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'playingGame',

  data: function () {
    return {
      timer: 15,
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      poll: {},
      gameCode: 0,
      name: '',
      isHost: false,
      playerList: [],
      answerList: [],
      sneakDict: {},
      currentPlayer: {},
      allegationsLeft: 0,
      answers: [],
      selectedPlayer: null,
      showSneakPeakButton: true,
    };
  },

  computed: {
    countPercentageAlligator() {
      return (this.timer / 15) * 100;
    },
    randomizedPlayers() {
      const randomized = this.playerList.slice().sort(() => Math.random() - 0.5);
      return randomized.slice(0, 4);
    },
  },

  created() {
    this.gameCode = this.$route.params.gameCode
    this.name = this.$route.params.name
    this.isHost = this.$route.params.isHost === 'true';
    socket.emit("pageLoaded", this.lang);
    socket.emit("getPoll", this.gameCode);
    socket.on("pullPoll", (poll) => {
      this.poll = poll
      socket.emit('getPlayerList', this.gameCode, poll.correctAnswer);
      socket.on('playerList', (playerList) => {
        this.playerList = playerList
      });
    });
    socket.emit('findCurrentPlayer', this.gameCode, this.name);
    socket.on('currentPlayer', (player) => {
      this.currentPlayer = player
    })
    socket.emit('allegationsLeft', this.gameCode)
    socket.on('allegationsRemaining', (aL) => {
      this.allegationsLeft = aL;
    })
    socket.on('answers', (answer) => {
      socket.emit('updateSneakDict', this.gameCode, this.playerList)
      socket.on('sneakDict', (sneakDict) => {
        this.sneakDict = sneakDict
      })
    })
    this.startCountdown();
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },

  methods: {
    startCountdown() {
      var countdownInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(countdownInterval);
          this.goToPodiumView();
        }
      }, 1000);
    },
    implementFiftyFifty: function () {
      if (!this.currentPlayer.answerLock) {
        let index = this.playerList.indexOf(this.poll.correctAnswer);
        if (index === 0 || index === 1) {
          this.playerList.splice(2);
        }
        else {
          this.playerList.splice(0, this.playerList.length - 2);
        }
        this.currentPlayer.fiftyfifty = false;
        socket.emit('changeFiftyFifty', this.gameCode, this.name)
      }
    },
    goToPodiumView() {
      this.currentPlayer.visible = false;
      if (this.poll.counter > 0) {
        this.$router.push('/Podium/' + this.gameCode + '/' + this.name + '/' + this.isHost);
      }
      else {
        this.$router.push('/Final/' + this.gameCode + '/' + this.name + '/' + this.isHost);
      }
    },
    submitAnswer: function () {
      if (!this.currentPlayer.answerLock && this.timer > 0 && this.selectedPlayer !== null) {
        socket.emit('submitAnswer', this.gameCode, this.name, this.selectedPlayer);
        this.currentPlayer.visible = false;
      }
    },
    sneakPeak: function () {
      if (this.currentPlayer.sneakPeak && !this.currentPlayer.answerLock) {
        this.currentPlayer.visible = true;
        socket.emit('usedSneakPeak', this.gameCode, this.name);
        socket.emit('updateSneakDict', this.gameCode, this.playerList)
        socket.on('sneakDict', (sneakDict) => {
          this.sneakDict = sneakDict
        })
        this.showSneakPeakButton = false;
      }
    }
  },
};
</script>

<style scoped>
.head_picture {
  height: 60px; 
  margin: 1.5vh;
}

img {
  height: auto;
  max-width: 20vw;
  transition: clip-path 1s ease;
  margin: 0 auto;
} 

.allNr {
  padding: 3px;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
  border: 4px solid yellow;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
}

.text-frame {
  border: 4px solid green;
  padding: 5px;
  width: 80vw;
  font-size: 22px;
  font-weight: bold;
  height: 15vh;
  resize: none;
  overflow-wrap: break-word;
  margin: 0 auto;
  font-family: monospace;
}

.alligator-container {
  overflow: hidden;
  text-align: center;
  margin-top: 10px;
}

.wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 45px 50px 0px 50px;
  gap: 25px;
}

.sneakpeak {
  color: green;
  border: 4px solid green;
  font-weight: bold;
  font-size: 10px;
  padding: 8px;
  margin: -30px 5px 10px 0px;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
}

.lifeline {
  width: 150px;
  height: 45px;
  border-radius: 25px;
  background-color: yellow;
  border: 6px solid green;
  text-align: center;
  color: red;
  display: inline-block;
  font-size: 15px;
  font-family: monospace;
  position: relative;
  top: -40px;
  font-weight: bold;
}

.lifeline:hover {
  cursor: pointer;
}

.playerLists {
  color: yellow;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  text-align: center;
  gap: 5.5vw;
}

.grid-container {
  display: flex;
  gap: 30px;
}

.custom-radio-input {
  display: none;
}

.custom-radio-button {
  display: flex;
  gap: 25px;
  padding: 15px;
  font-size: 25px;
  font-weight: bold;
  font-family: monospace;
  border: 2px solid black;
  border-radius: 50px;
  cursor: pointer;
  width: 220px;
  justify-content: center;
  margin-bottom: 25px;
  border: 0.1875em solid #2a9451;
}

.custom-radio-input:checked+.custom-radio-button {
  background-color: #3fbc6a;
}

@media screen and (max-width:50em) {
  .text-frame {
    font-size: 20px;
    height: 20vh;
  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {

  img {
    max-width: 40vw;
  }

  .custom-radio-button {
    font-size: 16px;
    width: 125px;

  }

  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .grid-item {
    margin-bottom: -20px;
  }
}</style>