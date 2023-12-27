<template>
  <header> 
      <h1>
          Game Time!
          <img src="/img/Head_picture.png" class="head_picture">
      </h1>
    </header>
    <div class="allNr">
      <span class="topNumber">{{ this.allegationsLeft }}</span>
      <span class="bottomNumber">{{ "&frasl;" }}</span>
      <span class="bottomNumber">{{ poll.totalAllegations }}</span>
    </div>

  <div class=text-frame>
      <p>{{ poll.randomAllegation }}</p></div>

      <div class="alligator-container">
      <img :style="{ clipPath: 'inset(0 ' + (110 - countPercentageAlligator) + '% 0 0)' }" src="../../public/img/alligatorTimer.png"  alt="countDownAlligator" />
    </div>

    <div class='timerDispaly' style="text-align: center;">
        <p v-if="timer > 0"> {{ timer }} </p>
        <p v-else="timer === 0" > {{ goToPodiumView() }} </p> 
    </div>
    <div class="wrap">
    <div v-if="showSneakPeakButton">
      <button v-if="this.currentPlayer.sneakPeak && this.poll.lifeLine" v-on:click="sneakPeak" class="lifeline"> Sneak Peak! </button>
    </div>
    <div v-if="this.currentPlayer.visible" class="sneakpeak">
      {{ uiLabels['opponentAnswer'] }}
      <p v-for="(count, name) in this.sneakDict">
        {{ name }}: {{ count }}
      </p>
    </div>
    <div>
      <button v-if="this.currentPlayer.fiftyfifty && this.poll.lifeLine" v-on:click="implementFiftyFifty" class="lifeline"> 50/50 </button>
    </div>
    </div>
    <div style="text-align: center; display: flex; justify-content: center;">
    <label v-for="(player, index) in randomizedPlayers" :key="index" class="custom-radio-label">
      <input type="radio" :id="'player_' + index" :value="player" v-model="selectedPlayer" @change="submitAnswer" :disabled="answerLock" class="custom-radio-input"/>
      <span class="custom-radio-button">{{ player }}</span>
    </label>
  </div>
</template>

<script>

import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
name: 'playingGame',
components: {
ResponsiveNav
},
data: function() {
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
  answerLock: false,
  allegationsLeft: 0,
  answers: [],
  selectedPlayer: null,
  answerLock: false,
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
socket.on('allCheckDone', (check) => {
  if (check) {
    this.goToPodiumView()
  }
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
  implementFiftyFifty: function() {
    let index = this.playerList.indexOf(this.poll.correctAnswer);
    if (index === 0 || index === 1){
      this.playerList.splice(2);
    }
    else {
      this.playerList.splice(0, this.playerList.length-2);
    }
    this.currentPlayer.fiftyfifty = false; 
    socket.emit('changeFiftyFifty', this.gameCode, this.name)
  },

  goToPodiumView() {
    this.currentPlayer.visible = false;
    if (this.poll.counter > 0) {
      this.$router.push('/Podium/' + this.gameCode +'/' + this.name + '/' + this.isHost);
    }
    else {
      this.$router.push('/Final/' + this.gameCode +'/' + this.name + '/' + this.isHost);
    }
    },
    
    submitAnswer: function () {
    if (!this.answerLock && this.timer > 0 && this.selectedPlayer !== null) {
      socket.emit('checkAllDone', this.gameCode)
      socket.emit('submitAnswer', this.gameCode, this.name, this.selectedPlayer);
      this.answerLock = true;
      this.currentPlayer.visible = false;
    }
  },

  sneakPeak: function () {
    if (this.currentPlayer.sneakPeak) {
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

/* custom-radio-label {
  display: inline-block;
} */

.custom-radio-input {
  display: none;
}

.custom-radio-button {
  display: flex;
  gap: 25px;
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
  border: 2px solid black;
  border-radius: 50px;
  cursor: pointer;
  margin-bottom: 25px;
}

.custom-radio-input:checked + .custom-radio-button {
  background-color: #3fbc6a;
  color: white;
}

.head_picture{
  height: 8vh; 
  margin: 1.5vh; 
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
}
.topNumber {
  padding: 3px
}
.bottomNumber {
  padding: 3px
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

img {
height: auto;
max-width: 15vw;
transition: clip-path 1s ease;
margin: 0 auto;
}

#pollName{
display: flex;
justify-content: center;
align-items: center;
width:min-content;
height: 50px; 
border-radius: 40px; 
border: 3px solid blue;
padding: 10px;
margin:0px auto;
color: blue;
text-align: center;
background-color: #81b8ce;
width: 220px;
margin-top: -100px;
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

.wrap{
display: flex;
align-items: center;
justify-content: center;
margin: 75px 50px 0px 50px;
gap: 150px;
}

.sneakpeak {
color: green;
border: 4px solid green;
border-radius: 15%;
font-weight: bold;
font-size: 20px;
padding: 15px;
margin: -160px 0px 10px 0px;
}


@media screen and (max-width:50em) {
  
.text-frame {
  font-size: 20px; 
  height: 27vh;
}

img {
max-width: 35vw;
}}

.wrap{
margin: 25px 50px 0px 50px;
gap: 25px;
}

.custom-radio-button {
  font-size: 15px;
  margin-bottom: 10px;
}

.sneakpeak {
border: 2px solid green;
border-radius: 15%;
font-size: 10px;
padding: 8px;
margin: -50px 15px 5px -25px;
}
</style>