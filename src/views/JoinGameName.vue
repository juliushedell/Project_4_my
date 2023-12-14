<template>
  <div>
    <header>
      <h1>
        {{ uiLabels["Choosename"] }}
        <img src="/img/Head_picture.png" class="head_picture">
      </h1>
    </header>
    <body>
      <div class="wrap">
        {{ uiLabels["enterName"] }}
        <p> 
          <input type="text" id="gameName" v-model="name" required="required" > 
        </p>
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
    }
  },
  created: function () {
    this.gameCode = this.$route.params.gameCode
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
  },
  methods: {
    namePlayer: function () {
  socket.emit('checkName', { gameCode: this.gameCode, name: this.name });
  socket.on('nameChecked', (checkedName) => {
    if (!checkedName) {
      this.$router.push({name: 'Lobby',params: { gameCode: this.gameCode, name: this.name, isHost: this.isHost },
      });
    } else {
      alert(this.uiLabels['nameUsed']);
      console.log('Name is already in use.');
    }
  });
}

  }
}
</script>

<style>
.wrap{
  display: grid;
  grid-gap: 5em;
  grid-template-columns: repeat(2, 1fr);
  margin: 50px 100px 50px 100px;
}

#gameName{
  border-radius: 8px;
  color: green;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
}
</style>
