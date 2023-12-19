<template>
    <header> 
        <h1>
            {{uiLabels['Leaderboard']}}
            <img src="/img/Head_picture.png" class="head_picture">
        </h1>
    </header>
        <div class="answerDisplay">
        <h3>
            {{ uiLabels['answer'] }} {{ poll.correctAnswer }}
        </h3>
    </div>
    <div class=podiumFrame>
      <div>
        {{theScoreboard}}
    <div v-for="i in theScoreboard" :key="i" >
        <template v-if="typeof i !=='undefined' && i.length > 0 ">
        {{ i[0].points }}
        <div v-for="j in i" :key="j">
        <template v-if="(typeof j !=='undefined')">
        {{ j.name }}
        <br>
       </template>
      </div>
        </template>
    </div>

      <!-- <li v-for="(object, index) in theScoreboard.array1st" :key="index">
       1st {{ theScoreboard.array1st[index].name }} <span class="score"> {{ theScoreboard.array1st[index].points }} points</span>
      </li>
      <li v-for="(object, index) in theScoreboard.array2nd" :key="index">
       2nd {{ theScoreboard.array2nd[index].name }} <span class="score"> {{ theScoreboard.array2nd[index].points }} points</span>
      </li>
      <li v-for="(object, index) in theScoreboard.array3rd" :key="index">
       3rd {{ theScoreboard.array3rd[index].name }} <span class="score"> {{ theScoreboard.array3rd[index].points }} points</span>
      </li> -->
    <!-- </ul> -->
  </div>
    </div>
    Your current points: {{ currentPlayer.points }}
    <button v-if="this.isHost" v-on:click="nextAllegation" class="button">{{ uiLabels["nextQuestion"] }}</button>
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
    lang: localStorage.getItem("lang") || "en",
    hideNav: true,
    poll: {},
    gameCode: 0,
    name: '',
    isHost: false,
    playerList: [],
    currentPlayer: {},
    theScoreboard: []
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
    console.log(theScoreboard) 
    this.theScoreboard = theScoreboard
  })
  socket.on("init", (labels) => {
    this.uiLabels = labels
  });
  socket.on("startGame", () =>
  this.$router.push ('/playingGame/' + this.gameCode +'/' + this.name + '/' + this.isHost)
  );
  socket.on("nextAllegation", () =>
  this.$router.push ('/playingGame/' + this.gameCode +'/' + this.name + '/' + this.isHost)
  );
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

  nextAllegation: function() {
    socket.emit("jumpToNextAllegation", this.gameCode)
    socket.emit('randomAllegation', this.gameCode)
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