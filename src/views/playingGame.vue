<template>
 <!-- Till denna sidan måste vi skicka alligations med tillhörande user, skapa en funkation osm plockar ut en alligation slumpmässigt och dispalyar den -->
    <header> 
        <h1>
            Game Time!
            <img src="/img/Head_picture.png" class="head_picture">
        </h1>
      </header>
      Allegation:  {{ this.allegationsLeft }} / {{ poll.totalAllegations }}

    <div class=text-frame>
        <p>{{ poll.randomAllegation }}</p></div>

      <div class="alligator-container">
      <img :style="{ clipPath: 'inset(0 ' + (110 - countPercentageAlligator) + '% 0 0)' }" src="../../public/img/alligatorTimer.png"  alt="countDownAlligator" />
    </div>

    <div class=timerDispaly style="text-align: center;">
        <p v-if="timer > 0"> {{ timer }} </p>
        <p v-else="timer === 0" > {{ goToPodiumView() }} </p> 
    </div>
    <div>
      <button v-if="this.currentPlayer.sneakPeak && this.poll.lifeLine" v-on:click="sneakPeak" id="sneakPeak"> Sneak Peak! </button>
    </div>
    <div v-if="this.currentPlayer.visible">
      {{ uiLabels['opponentAnswer'] }}
      <p v-for="(count, name) in this.poll.sneakDict">
        {{ name }}: {{ count }}
      </p>
    </div>
    <div>
      <button v-if="this.currentPlayer.fiftyfifty && this.poll.lifeLine" v-on:click="implementFiftyFifty" class="button"> 50/50 </button>
    </div>
    <div style="text-align: center; display: flex; justify-content: center;">
    <button v-for="(player, index) in randomizedPlayers" :key="index" v-on:click="submitAnswer(player)" id="pollName"> {{ player }} </button> 
    </div>
</template>

<script>

import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

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
    currentPlayer: {},
    answerLock: false,
    allegationsLeft: 0,
    answers: [],
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
    socket.emit('findCurrentPlayer', this.gameCode, this.name);
    socket.on('currentPlayer', (player) => {
        this.currentPlayer = player
    })
    socket.emit('getPlayerList', this.gameCode, poll.correctAnswer);
    socket.on('playerList', (playerList) => {
    this.playerList = playerList
    for (let i = 0; i < this.playerList.length; i++) {
          const name = this.playerList[i];
          this.poll.sneakDict[name] = 0;
      }
  });
  });
  socket.emit('allegationsLeft', this.gameCode)
  socket.on('allegationsRemaining', (aL) => {
    this.allegationsLeft = aL;
  })
  socket.on('answers', (answer) => {
    for (const key in this.poll.sneakDict) {
      if (answer === key) {
        this.poll.sneakDict[answer] += 1;
      }
    }
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
     if(this.poll.counter > 0) {
      this.$router.push('/Podium/' + this.gameCode +'/' + this.name + '/' + this.isHost);
      } else {
        this.$router.push('/Final/' + this.gameCode +'/' + this.name + '/' + this.isHost);
      }
      this.currentPlayer.visible = false;
      socket.emit('compareAnswer', this.gameCode, this.name);
      if (this.poll.counter > 0) {
        this.$router.push('/Podium/' + this.gameCode +'/' + this.name + '/' + this.isHost);
      }
      else {
        this.$router.push('/Final/' + this.gameCode +'/' + this.name + '/' + this.isHost);
      }
      },

    submitAnswer: function (player) {
      if (!this.answerLock && this.timer !== 0) {
        socket.emit('submitAnswer', this.gameCode, this.name, player);
        this.answerLock = true;
      }
    },

    sneakPeak: function () {
      if (this.currentPlayer.sneakPeak) {
        this.currentPlayer.visible = true;
        this.currentPlayer.sneakPeak = false;
        socket.emit('usedSneakPeak', this.gameCode, this.name);
    }
  }
},
};
</script>

<style>

.text-frame {
    border: 4px solid green;
    padding: 2vw; 
    width: 80vw; 
    height: 25vh; 
    resize: none;
    overflow-wrap: break-word;
    margin: 0 auto;
    margin-top: 4vh; 
    font-family: 'Comic Sans MS';
    font-size: 1.5vw; 
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
  margin:40px auto;
  color: blue;
  text-align: center;
  background-color: #81b8ce;
 
}


@media screen and (max-width:50em) {
    
.text-frame {
    font-size: 2.8vw; 
    height: 30vh; 
}

img {
  max-width: 35vw;
}

}

</style>