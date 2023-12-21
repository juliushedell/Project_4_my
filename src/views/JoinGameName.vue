<template>
  <div>
    <header>
      <h1>
        {{ uiLabels["Choosename"] }}
        <img src="/img/Head_picture.png" class="head_picture">
      </h1>
    </header>
    <body>


      <div class="explainingText">
        {{ uiLabels["enterName"] }}
      </div>

      <div class="gameNameField">
        <input type="text" id="gameName" v-model="name" required :maxlength="15" @input="checkNameLength"> 
      </div>

      <div class="wrap">
        <router-link to="/JoinGameCode/" class="back">{{ uiLabels["back"] }}</router-link>
        <button @click="namePlayer" class="button" type="submit">{{ uiLabels["next"] }}</button>
      </div>
    </body>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'JoinGameName',
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      name: '',
      gameCode: 0,
      isHost: false,
      player: {},
      poll: {},
    }
  },
  created: function () {
    this.gameCode = this.$route.params.gameCode
    socket.emit("pageLoaded", this.lang);
    socket.emit("getPoll", this.gameCode);
    socket.on("pullPoll", (poll) => {
    this.poll = poll
    })
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
  },
  methods: {
    checkNameLength() {
      if (this.name.length === 15) {
        alert(this.uiLabels['tooLongName'] + 'https://www.skatteverket.se/privat/folkbokforing/namn.4.18e1b10334ebe8bc80004083.html');
      }
    },
    namePlayer: function () {
    this.buttonClicked = true;
    socket.emit('checkName', { gameCode: this.gameCode, name: this.name });
    socket.on('nameChecked', (checkedName) => {
    if (!checkedName) {
      this.$router.push({name: 'Lobby',params: { gameCode: this.gameCode, name: this.name, isHost: this.isHost },
      });
    } else {
      alert(this.uiLabels['nameUsed']);
    }
  });
}
  }
}
</script>

<style scoped>
.explainingText{
  margin-top: 100px;
  font-size: 20px;
  color: #2a9451;
  font-weight: bolder;
  text-align: center;
}

.nameField{
  margin: 0px 10px 80px 10px;
  text-align: center;
}

.wrap{
  grid-template-columns: auto auto;
  display:grid; 
  justify-content: center;
  gap: 500px;
  padding-top: 55px;
 
}

.gameNameField {
  margin: 0px 10px 80px 10px;
  text-align: center;
}

#gameName {
  border-radius: 8px;
  color: #2a9451; 
  font-size: 16px;
  padding: 10px;
  margin: 10px;
}
  

@media screen and (max-width:50em) {
.head_picture{
  height: 60px; 
  margin: 10px;
}

.wrap{  
  margin-top:300px;
  justify-content: center;
  gap: 20px; 
}
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  .wrapper {
    margin-top: 450px; 
  }
}
</style>
