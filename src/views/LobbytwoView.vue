<template>
    <header> 
        <h1>
            Lobby
            <img src="/img/Head_picture.png" class="head_picture">
        </h1>
    </header>
    <div class="code">
        <h2 id="gameCode">
            {{ this.gameCode }}
        </h2>
    </div>
    <div class="pollName">
        {{ gameName_data }}
    </div>
    {{ poll }}
      xxxx
    {{ players }}
    <br>
        <router-link to="/" class="back"> {{ uiLabels["cancel"] }}</router-link>
        <router-link to="/playingGame/" class="button">{{ uiLabels["start"] }}</router-link>

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
    id: "",
    lang: localStorage.getItem("lang") || "en",
    hideNav: true,
    // lagrar confessions i array
    conf:[],
    poll: {},
    gameCode: 0,
    players: {}, 
    isInputDisabled: false //grundvariabel som gör att det går att redigera i iinput fieldsen
  }
},
created: function () {
  this.gameCode = this.$route.params.gameCode
  socket.emit("pageLoaded", this.lang);
  socket.emit("getPoll", this.gameCode);
  socket.emit("getPlayers", this.gameCode);
  socket.on("pullPlayer", (players) => {
    this.players = players
  })
  socket.on("pullPoll", (poll) => {
    this.poll = poll
  })
  socket.on("init", (labels) => {
    this.uiLabels = labels
  })
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
  toggleNav: function () {
    this.hideNav = ! this.hideNav;
  },
  submitConfessions: function() {
  // socket.emit("addConfessions", {gameCode: this.gameCode, conf: this.conf});
  this.conf = this.poll.allegations;
  console.log(this.conf);
  this.isInputDisabled = true; //la till detta för att kunna göra det omöjligt att redigera sina allegations efter att man klickat på submit 
  console.log("tjena") //den verkar inte nå hit när man klickar på knappen
  }
 }}
</script>

<style>
.pollName{
  display: flex;
  justify-content: center;
  align-items: center;
  width:min-content;
  height: 30px; 
  border-radius: 40px; 
  border: 2px solid blue;
  padding: 10px;
  margin:40px auto;
  color: blue;
  text-align: center;
}

.button{
    position: fixed;
    bottom: 10vh; 
    right: 8vw; 
}

.back{
    position: fixed;
    bottom: 10vh; 
    left: 8vw; 
}

.code{
    align-items: center;
    justify-content: center;
}

#gameCode {
  width: 8vw; /* Adjusted width to 8% of viewport width */
  height: 3vh; /* Adjusted height to 3% of viewport height */
  border-radius: 3.125em;
  background-color: #81b8ce;
  border: 0.1875em solid yellow;
  color: blue;
  text-align: center;
  text-decoration: none;
  padding: 1.25vw; /* Adjusted padding to 1.25% of viewport width */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>