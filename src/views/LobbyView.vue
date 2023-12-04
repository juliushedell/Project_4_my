<template>
<header>
      <h1>
        Lobby
        <img src="/img/Head_picture.png" class="head_picture">
      </h1>
    </header>
    <body>
        <h3>
          {{ uiLabels['gameCode'] }}: 
            {{ $route.params.gameCode }}
        </h3>
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
    this.uiLabels = labels;
  });

  const { gameCode, name, numberAllegations, theme } = this.$route.params;
  this.gameCode = gameCode;
  this.name = name;
  this.numberAllegations = numberAllegations;
  this.theme = theme;
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
    generateGameCode: function () {
    return Math.floor(Math.random() * 100000);
  }
  }
}
</script>


<style>
</style>