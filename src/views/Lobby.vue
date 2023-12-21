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
      {{ getTheme }}
    </h3>
    
      <!-- skapar fields till confessions -->
      <div id="parent-container">
      <form id="confessionsform">
        <div>
          <div v-for="i in poll.numberAllegations" :key="i">
            <label for="confession{{ i }}" class="all"> Allegation {{ i }} :  </label>
            <textarea type="text" class="field" id="field{{ i }}" v-model="allegations[i-1]" :maxlength="145" @input="checkAllegationLength" :class="{'invalid-input': isInputEmpty(i - 1) && buttonClicked}" :placeholder="uiLabels.enterAllegations" required>
              </textarea>
            <br><br>
          </div>
        </div>
      </form>
    </div>
      <div class="wrappp">
        <!-- <router-link v-if="this.isHost" to="/Create/" class="back" >{{ uiLabels["back"] }}</router-link>
        <router-link v-else to="/JoinGameName/{{this.gameCode}}" class="back" >{{ uiLabels["back"] }}</router-link> -->
        <button v-on:click="goBack" class="back">{{ uiLabels["back"] }}</button>
        <button v-on:click="submitConfessions" class="button" >{{ uiLabels["submit"] }}</button> 
      </div>
      <br>
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
    allegations: [],
    numberAllegations: 1,
    theme: "",
    name:'',
    buttonClicked: false,
    currentPlayer: {}
  
  }
},
computed: {
  getTheme: function() {
    const theme = this.theme;
    return this.uiLabels[theme] || this.theme
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
  })
  socket.on("pullPoll", (poll) => {
    this.poll = poll
    this.theme = poll.theme
  })
  socket.emit('findCurrentPlayer', this.gameCode, this.name);
  socket.on('currentPlayer', (player) => {
      this.currentPlayer = player
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
  checkAllegationLength() {
    for (let i = 0; i < this.allegations.length; i++) {
      if (this.allegations[i].length === 145) {
        alert('Too much information, nobody cares!');
      }
    }
  },

  isInputEmpty(i) {
    return this.allegations[i] === undefined || !this.allegations[i];
  },

  submitConfessions: function() {
    this.buttonClicked = true;

    // Flag to check if any input field is empty
    let isEmptyField = false;

    for (let i = 0; i < this.poll.numberAllegations; i++) {
      // Call isInputEmpty method to check if the input is empty
      if (this.isInputEmpty(i)) {
        isEmptyField = true;
        break; // exit the loop early if an empty allegation is found
      }
    }
    // If any field is empty, do not proceed
    if (isEmptyField) {
      return;
    }
    // Proceed with form submission
    socket.emit("submitConfessions", { gameCode: this.gameCode, allegations: this.allegations, name: this.name, isHost: this.isHost });
    this.$router.push('/Lobbytwo/' + this.gameCode + '/' + this.name + '/' + this.isHost);
  },

  goBack: function(){
      if (this.isHost){
        this.$router.push('/Create/')
      }
      else{
        this.$router.push('/JoinGameName/'+this.gameCode)
      }
    }
  }
}
</script>


<style scoped>
#name {
  text-align: center;
  margin-top: 0.3em; 
}

#gameCode {
  text-align: center;
  margin-top: 1em;
  font-size: 40px;
  font-family: monospace;
}
.field{
  border-radius: 8px;
  font-size: 15px;
  width: 450px;
  height: 55px;
  padding: 8px;
}
#parent-container {
  text-align: center; 
}
#confessionsform label.all {
  font-size: 30px;
  color: #2a9451;
  font-weight: bold;
  font-family: monospace;
  display: inline-block; 
}
/* .button{
  width: 120px; 
  height: 1px;
  font-size: 30px;
  margin-left: auto;
  font-size: 20px;
  margin-right:10px;
} */
#theme{
  text-align: center;
}

.wrappp{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 50px 0px 50px;
  gap: 50px;
}

#theme{
  color: yellow;
  font-size: 28px;
  font-family: monospace;
}

.all {
  font-size: 32px;
}

/* #pollName{
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
} */
.invalid-input {
  border: 3px solid red;
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  .all {
  font-size: 27px;
}

.field {
  width: 350px;
  height: 70px;
}
}
</style>