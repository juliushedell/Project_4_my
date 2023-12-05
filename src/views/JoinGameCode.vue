<template>
    <header>
      <h1>
        {{ uiLabels["joinGame"] }}
        <img src="/img/Head_picture.png" class="head_picture">
      </h1>
    </header>
    <body> 
      <div class="center">
        <p class="a"> 
          <input type="number" id="gameCode" v-model="gameCode_data" required="required" > 
        </p>
        <div class="b">
          <router-link to="/" class="back" >{{ uiLabels["back"] }}</router-link>
          <router-link to="/JoinGameName/" v-on:click="codePlayer" class="button">{{ uiLabels["joinGame"] }}</router-link>
        </div>
    </div>
    </body>
</template>




<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      gameCode_data:0
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
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
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    },
    codePlayer: function () {
    socket.emit("codePlayer", {  lang: this.lang,
      gameCode_data: this.gameCode_data,})
    console.log(this.gameCode_data)
  },
  }
}
</script>

<style>
.center{
  padding: 50px;
  text-align: center;
}

.a {
  margin: 10px 10px 80px 10px;
}

.b {
  margin: 80px 10px 80px 10px;
}

#gameCode{
  border-radius: 8px;
  color: green;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
}
</style>