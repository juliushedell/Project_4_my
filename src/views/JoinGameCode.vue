<template>
  <header>
    <h1>
      {{ uiLabels["joinGame"] }}
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>


  <div class="initialText">
  <label  for="gameCode"> {{ uiLabels["explain"] }} </label>
  </div>

  <div id="codeField">
    <input ref="gameCodeInput" type="number" id="gameCode" v-model="gameCode" @keyup.enter="checkPollId" required >
  </div>

  <div class="wrapper">
    <router-link to="/"  class="back" >{{ uiLabels["back"] }}</router-link>
    <button @click="checkPollId" class="button" >{{ uiLabels["joinGame"] }}</button>
  </div>

  <div class="custom-alert" v-if="this.showAlertEnterCode">
        <div class="alert-content">
          {{uiLabels["enterGameCode"]}} 
          <br><br>
        <button class="closeButton" @click="closeAlertEnterCode">{{uiLabels["closePopUp"]}}</button>
      </div>
  </div>

  <div class="custom-alert" v-if="this.showAlertDontExist">
        <div class="alert-content">
          {{uiLabels["notAGame"]}} 
          <br><br>
        <button class="closeButton" @click="closeAlertDontExist">{{uiLabels["closePopUp"]}}</button>
      </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'JoinGameCode',
  data: function () {
    return {
      gameCode: null,
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      showAlertEnterCode: false,
      showAlertDontExist: false  
    }
  },
  mounted() {
    this.$refs.gameCodeInput.focus();
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    checkPollId() {
      if (!this.gameCode) {
        this.showAlertEnterCode = true; 
      } 
      else {
        socket.emit("getPoll", this.gameCode);
        socket.on("pullPoll", (poll) => {
          this.poll = poll
          console.log(poll)
          if (poll === "undefined") {
            this.showAlertDontExist = true; 
          } else {
            this.$router.push({ name: 'JoinGameName', params: { gameCode: this.gameCode } });
          }
        });
      }
    },
    closeAlertEnterCode(){
      this.showAlertEnterCode = false;
    },
    closeAlertDontExist(){
      this.showAlertDontExist = false; 
    }
  }
}
</script>

<style scoped>

#codeField{
  margin: 0px 10px 80px 10px;
  text-align: center;
}

#gameCode {
  border-radius: 8px;
  color: #2a9451; 
  font-size: 16px;
  font-family: monospace;
  padding: 10px;
  margin: 10px;
}

.wrapper{
  grid-template-columns: auto auto;
  display:grid; 
  justify-content: center;
  gap: 500px;
  padding-top: 55px;
}

.back{
  justify-self: start;
  margin-left: 25vw;
}

.button{
  margin-right: 25vw;
  justify-self:end;
  width: 150px; 
  height: 50px;  
}

#gameCode::-webkit-outer-spin-button,
  #gameCode::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

.initialText{
  margin-top: 100px;
  font-size: 20px;
  color: #2a9451;
  font-family: monospace;
  font-weight: bolder;
  text-align: center;
}

@media screen and (max-width:50em) {
.head_picture{
  height: 60px; 
  margin: 10px;
}

.wrapper{  
  margin-top:300px;
  justify-content: center;
  gap: 20px; 
}
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  .wrapper {
    margin-top: 200px; 
  }
}

</style>
