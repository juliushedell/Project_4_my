<template>
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
    <router-link to="/" class="back">{{ uiLabels["back"] }}</router-link>
    <router-link to="/JoinGameCode/" v-on:click="namePlayer" class="button" type="submit">{{ uiLabels["next"] }}</router-link>
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
      hideNav: true
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
    namePlayer: function () {
    socket.emit("namePlayer", {game_id: this.game_id,
                                 lang: this.lang,
                                 name_of_player: this.name_of_player,})
    console.log(this.name_of_player)
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