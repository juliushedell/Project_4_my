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
  <div id="parent-container">
    <form id="confessionsform">
      <div id="spacingFields" v-for="i in poll.numberAllegations" :key="i">
        <label for="confession{{ i }}" class="all"> Allegation {{ i }}: &nbsp;</label>
        <textarea :ref="textareaRef(i - 1)" type="text" class="field" id="field{{ i }}" v-model="allegations[i-1]" @keyup.enter="submitConfessions" :maxlength="145" @input="checkAllegationLength" :class="{'invalid-input': isInputEmpty(i - 1) && buttonClicked}" :placeholder="uiLabels.enterAllegations" required>
        </textarea>
      </div>
    </form>
  </div>
  <div class="custom-alert" v-if="this.showAlert">
    <div class="alert-content">
      {{uiLabels["tooMuchInfo"]}} 
      <button class="closeButton" @click="closeAlert">{{uiLabels["closePopUp"]}}</button>
    </div>
  </div>
  <div class="custom-alert" v-if="this.showAlertEnd">
    <div class="alert-content">
      {{uiLabels["hostEndedGame"]}} 
      <button class="closeButton" @click="closeAlertEnd">{{uiLabels["closePopUp"]}}</button>
    </div>
  </div>
  <div class="wrappp">
    <button v-on:click="goBack" class="back">{{ uiLabels["back"] }}</button>
    <button v-on:click="submitConfessions" class="button" >{{ uiLabels["submit"] }}</button> 
  </div>
</template>
<script>
  import io from 'socket.io-client';
  const socket = io(sessionStorage.getItem("dataServer"));
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
      textAreaOne: true,
      currentPlayer: {}, 
      showAlert: false,
      showAlertEnd: false,
      isHost: false
    }
  },
  updated() {
    if (this.$refs[this.textareaRef(0)] && this.textAreaOne) {
      this.$refs[this.textareaRef(0)][0].focus();
      this.textAreaOne = false;
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
    socket.on('endTheGame', () => {
      console.log('tar den sig till socket.on??', this.showAlertEnd)
      if (this.isHost === "false") {
        console.log('Tar den sig innanför if??')
        this.showAlertEnd = true
        console.log('Är den true??? ', this.showAlertEnd)
      }
    })
  },
  methods: {
    textareaRef(index) {
        return `textarea${index}`;
      },
    checkAllegationLength() {
      for (let i = 0; i < this.allegations.length; i++) {
        if (this.allegations[i].length === 145) {
          this.showAlert = true;
        }
      }
    },
    closeAlert(){
        this.showAlert = false;
      },
    closeAlertEnd(){
      this.showAlertEnd = false;
      this.$router.push('/')
    },
    isInputEmpty(i) {
      return this.allegations[i] === undefined || !this.allegations[i];
    },
    submitConfessions: function() {
      this.buttonClicked = true;
      let isEmptyField = false;
      for (let i = 0; i < this.poll.numberAllegations; i++) {
        if (this.isInputEmpty(i)) {
          isEmptyField = true;
          break; 
        }
      }
      if (isEmptyField) {
        return;
      }
      socket.emit("submitConfessions", { gameCode: this.gameCode, allegations: this.allegations, name: this.name, isHost: this.isHost });
      this.$router.push('/Lobbytwo/' + this.gameCode + '/' + this.name + '/' + this.isHost);
    },
    goBack: function() {
        if (this.isHost === "true"){
          socket.emit('endPoll', this.gameCode)
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
  /* #name {
    text-align: center;
    margin-top: 0.3em; 
  } */
  #gameCode {
    text-align: center;
    margin-top: 1em;
    font-size: 40px;
    font-family: monospace;
    color: rgb(54, 54, 54);
  }
  .field{
    border-radius: 8px;
    border: 3px solid #3fbc6a;
    font-size: 15px;
    font-family: monospace;
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
    /* font-family: monospace; */
    /* display: inline-block; */
    vertical-align: top;
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
  #theme{
    color: yellow;
    font-size: 28px;
  }
  .invalid-input {
    border: 3px solid red;
  }
  .button{
    position: fixed;
    right: 3em;
    bottom: 3em;
  }
  .back{
    position: fixed;
    left: 3em;
    bottom: 3em;
  }
  #spacingFields{
    margin-top: 1em;
  }
@media screen and (max-width: 1161px){
    .wrappp{
    padding-top: 30px;
    }
    .back{
    position: relative;
    bottom: 1em;
    margin-left: -10px;
    min-width: 150px;
   }
    .button{
      position: relative;
      bottom: 1em; 
      margin-left: 150px;
      min-width: 150px;
    }
  }
  @media only screen and (max-width: 2532px) and (orientation: portrait) {
      .all {
      font-size: 27px;
    }
    .field {
      width: 350px;
      height: 70px;
    }
    .custom-alert {
        top: 35%;
    }
  }
</style>