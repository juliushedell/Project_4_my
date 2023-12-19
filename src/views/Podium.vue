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
      <div class="placement" v-for="(i, index) in theScoreboard" :key="i" >
            <template v-if="typeof i !=='undefined' && i.length > 0 ">
              <div id="placementNr">{{ index + 1 }}</div>
              <div id="points">{{uiLabels['points']}} {{ i[0].points }}</div>
              <div v-for="j in i" :key="j">
                <template v-if="(typeof j !=='undefined')">
                <div id ="name">{{ j.name }} </div>
                <br>
                </template>
              </div>
            </template>
        </div>
    </div>
    {{theScoreboard}}
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

<style scoped>
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
  text-align: center;
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

.placement{
  margin-bottom: 20px;
  text-align: center;
  justify-content: center;
  display:flex;
}

#placementNr{
  width: 50px; 
  height: 50px; 
  border: 2px solid goldenrod; 
  border-radius: 50%; 
  background-color: gold;
  justify-content: center;
  display:flex;
  text-align: center;
}

#points{

}

#name{
  
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