<template>
  <header>
    <h1>
      {{ uiLabels["joinGame"] }}
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>
  <div id="codeField">
    <input type="number" id="gameCode" v-model="gameCode" required="required"> 
  </div>
  <div class="wrapper">
    <router-link to="/"  class="back" >{{ uiLabels["back"] }}</router-link>
    <button @click="codePlayer" class="button" >{{ uiLabels["joinGame"] }}</button>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'JoinGameCode',
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      gameCode: 0
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
  methods: {
    codePlayer: function () {
      this.$router.push({ name: 'JoinGameName', params: { gameCode: this.gameCode } });
    }
  }
}
</script>

<style>
/* .center {
  padding: 50px;
  text-align: center;
}

.a {
  margin: 10px 10px 80px 10px;
}

.b {
  grid-template-areas: 
  'a b'; 
}

.button{
  position: right; 
} */

#codeField{
  align-items: center;
  margin: 10px 10px 80px 10px;
  padding: 50px;
  text-align: center;
}

#gameCode {
  border-radius: 8px;
  color: green;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
}

.wrapper{
  grid-template-columns: auto auto;
  display:grid; 
  justify-content: space-between;
  margin-top: 20px;
}

.back{
  justify-self: start;
}

.button{
  margin-right: 20px;
  justify-self:end 
  
}

</style>
