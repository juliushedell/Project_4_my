<template>
    <header> 
        <h1>
            Allegations
            <img src="/img/Head_picture.png" class="head_picture">
        </h1>
    </header>
    <h2 id="gameCode">
      {{ this.gameCode }}
    </h2>
    <h3 id="theme">
      {{ uiLabels["theme"] }}
      {{ poll.theme }}
    </h3>
      <!-- skapar fields till confessions -->
      <div id="parent-container">
      <form id="confessionsform">
        <div>
          <div v-for="i in poll.numberAllegations" :key="i">
            <label for="confession{{ i }}"> Allegation {{ i }} :  </label>
            <input type="text" class="field" id="field{{ i }}" v-model="allegations[i-1]" required="required" :placeholder="uiLabels.enterAllegations">
            <br><br>
          </div>
        </div>
      </form>
    </div>
      <!-- knapp som skickar confessions till submitConfessions  -->
      <div class="wrappp">
        <router-link to="/Create/" class="back" >{{ uiLabels["back"] }}</router-link>
        <button v-on:click="submitConfessions" id="submit" >{{ uiLabels["submit"] }}</button> 
      </div>
      <br>
      {{ poll }}
      xxxx
      {{ players }}
</template>

<script>

import io from 'socket.io-client';
const socket = io("localhost:3000");
export default {
name: 'enterAllegations',
data: function () {
  return {
    uiLabels: {},
    lang: localStorage.getItem("lang") || "en",
    poll: {},
    gameCode: 0,
    players: [], 
    isInputDisabled: false, //grundvariabel som gör att det går att redigera i iinput fieldsen
    allegations: [],
    name:''
  }
},

created: function () { 
  this.gameCode = this.$route.params.gameCode
  this.name = this.$route.params.name
  this.isHost = this.$route.params.isHost;
  socket.emit("pageLoaded", this.lang);
  socket.emit("getPoll", this.gameCode);
  socket.emit("getPlayers", this.gameCode);
  socket.on("pullPlayer", (players) => {
    this.players = players
    console.log(players)
  })
  socket.on("pullPoll", (poll) => {
    this.poll = poll
  })
  socket.on("init", (labels) => {
    this.uiLabels = labels
  })
  socket.on("confessionsSubmitted", (players) => {
    this.players = players
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
  submitConfessions: function() {
    socket.emit("submitConfessions", {gameCode: this.gameCode, allegations: this.allegations, name: this.name, isHost: this.isHost});
    this.isInputDisabled = true; //la till detta för att kunna göra det omöjligt att redigera sina allegations efter att man klickat på submit 
    this.$router.push ('/Lobbytwo/' + this.gameCode +'/' + this.name + '/' + this.isHost)
    }
 }}
</script>


<style>
#name {
  text-align: center;
  margin-top: 0.3em; 
}

#gameCode {
  text-align: center;
  margin-top: 0.3em;
}
.field{
  border-radius: 8px;
  color: black;
  font-size: 20px;
}
#parent-container {
  text-align: center; 
}
#confessionsform {
  font-size: 30px;
  color: #2a9451;
  font-weight: bold;
  display: inline-block; 
}
.button{
  width: 120px; 
  height: 1px;
  font-size: 30px;
  margin-left: auto;
  font-size: 20px;
  margin-right:10px;
}
#theme{
  text-align: center;
}

.wrappp{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 50px 0px 50px;
}

#submit{
  width: 170px; 
  height: 60px;
  border-radius: 40px;
  background-color: #3fbc6a;;
  border: 0.1875em solid #2a9451;
  font-size: 20px;
  color:yellow;
}

#theme{
  color: yellow;
}

#pollName{
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
</style>