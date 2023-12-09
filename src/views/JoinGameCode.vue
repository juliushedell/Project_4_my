<template>
  <div>
    <header>
      <h1>
        {{ uiLabels["joinGame"] }}
        <img src="/img/Head_picture.png" class="head_picture">
      </h1>
    </header>
    <div class="center">
      <p class="a"> 
        <input type="number" id="gameCode" v-model="gameCode" required="required"> 
      </p>
      <div class="b">
        <router-link to="/" class="back">{{ uiLabels["back"] }}</router-link>
        <button @click="codePlayer" class="button">{{ uiLabels["joinGame"] }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'JoinGameCode',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
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
.center {
  padding: 50px;
  text-align: center;
}

.a {
  margin: 10px 10px 80px 10px;
}

.b {
  margin: 80px 10px 80px 10px;
}

#gameCode {
  border-radius: 8px;
  color: green;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
}
</style>
