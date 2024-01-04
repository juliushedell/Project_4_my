<template>
  <header>
    <h1>
      {{ uiLabels['Leaderboard'] }}
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>
  <div class="answerDisplay">
    <h3>
      {{ uiLabels['answer'] }} {{ poll.correctAnswer }}
    </h3>
  </div>
  <div class=podiumFrame>
    <div class="placement" v-for="(i, index) in theScoreboard" :key="i">
      <template v-if="typeof i !== 'undefined' && i.length > 0">
        <div :class="{ 'gold': index === 0, 'silver': index === 1, 'bronze': index === 2 }">{{ index + 1 }}</div>
        <div id="points">{{ uiLabels['points'] }} {{ i[0].points }}</div>
        <div v-for="j in i" :key="j">
          <template v-if="(typeof j !== 'undefined')">
            <div id="name">{{ j.name }} </div>
          </template>
        </div>
      </template>
    </div>
  </div>
  <div class="yourpoints">
    {{ uiLabels['yourCurrentPoints'] }} {{ currentPlayer.points }}
  </div>
  <div class="wrapper">
    <button v-if="this.isHost" v-on:click="endGame" class="back"> {{ uiLabels["endGame"] }} </button>
    <button v-if="!this.isHost" v-on:click="endGame" class="back"> {{ uiLabels["leaveGame"] }} </button>
    <button v-if="this.isHost" v-on:click="nextAllegation" class="button">{{ uiLabels["nextQuestion"] }}</button>
  </div>
  <div class="custom-alert" v-if="this.showAlert">
    <div class="alert-content">
      {{ uiLabels["hostEndedGame"] }}
      <br><br>
      <button class="closeButton" @click="closeAlert">{{ uiLabels["closePopUp"] }}</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'LobbytwoView',
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      poll: {},
      gameCode: 0,
      name: '',
      isHost: false,
      showAlert: false,
      playerList: [],
      currentPlayer: {},
      theScoreboard: [],
    }
  },
  created: function () {
    this.gameCode = this.$route.params.gameCode
    this.name = this.$route.params.name
    this.isHost = this.$route.params.isHost === 'true';
    socket.emit("pageLoaded", this.lang);
    socket.emit('compareAnswer', this.gameCode);
    socket.emit("getPoll", this.gameCode);
    socket.on("pullPoll", (poll) => {
      this.poll = poll
      socket.emit('findCurrentPlayer', this.gameCode, this.name);
    });
    socket.on('currentPlayer', (player) => {
      this.currentPlayer = player
    })
    socket.on('scoreBoard', (theScoreboard) => {
      this.theScoreboard = theScoreboard
    })
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.on("startGame", () =>
      this.$router.push('/playingGame/' + this.gameCode + '/' + this.name + '/' + this.isHost)
    );
    socket.on("nextAllegation", () =>
      this.$router.push('/playingGame/' + this.gameCode + '/' + this.name + '/' + this.isHost)
    );
    socket.emit("getScoreboard", this.gameCode);
    socket.on('endTheGame', () => {
      console.log(this.isHost)
      if (!this.isHost) {
        this.showAlert = true;
      }
    })
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
    },

    nextAllegation: function () {
      socket.emit("jumpToNextAllegation", this.gameCode)
      socket.emit('randomAllegation', this.gameCode)
    },

    endGame: function () {
      if (this.isHost) {
        socket.emit('endPoll', this.gameCode)
        this.$router.push('/')
      }
      else {
        this.$router.push('/')
      }
    },
    closeAlert() {
      this.showAlert = false;
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.answerDisplay {
  color: green;
  font-family: monospace;
  font-size: 22px;
  text-align: center;
}

.podiumFrame {
  border: 8px double green;
  padding: 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 55vw;
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

.gold {
  width: 50px;
  height: 50px;
  border: 5px double goldenrod;
  border-radius: 50%;
  background-color: rgb(255, 215, 0);
  text-align: center;
  line-height: 50px;
  margin-bottom: 5px;
  font-weight: bold;
}

.silver {
  width: 50px;
  height: 50px;
  border: 5px double rgb(161, 160, 160);
  border-radius: 50%;
  background-color: rgb(192, 192, 192);
  text-align: center;
  line-height: 50px;
  margin-bottom: 5px;
  font-weight: bold;
}

.bronze {
  width: 50px;
  height: 50px;
  border: 5px double rgb(174, 100, 26);
  border-radius: 50%;
  background-color: rgb(205, 127, 50);
  text-align: center;
  line-height: 50px;
  margin-bottom: 5px;
  font-weight: bold;
}

#points {
  color: green;
  font-weight: bold;
}

#name {
  margin-bottom: 5px;
  font-weight: bold;
}

.wrapper {
  grid-template-columns: auto auto;
  display: grid;
  justify-content: center;
  gap: 200px;
  padding: 50px;
}

.yourpoints {
  color: green;
  margin-top: 20px;
  font-size: 16px;
  display: grid;
  justify-content: center;
}

.button {
  position: absolute;
  right: 50px;
  bottom: 50px;
}

.back {
  position: absolute;
  left: 50px;
  bottom: 50px;
}
</style>