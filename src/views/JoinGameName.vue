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
          <input type="text" id="gameName" v-model="gameName_data" required="required" > 
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
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'JoinGameName',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      gameName_data: '',
      gameCode: 0,
      isHost: false,
      player: {}
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
      this.$router.push({ name: 'Lobby', params: { gameCode: this.gameCode, pid: this.gameName_data } });
    },
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
