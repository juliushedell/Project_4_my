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
    <input type="number" id="gameCode" v-model="gameCode" required="required" >
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

#codeField{
  margin: 0px 10px 80px 10px;
  text-align: center;
}

#gameCode {
  border-radius: 8px;
  color: #2a9451; 
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
    margin-top: 450px; 
  }
}

</style>
