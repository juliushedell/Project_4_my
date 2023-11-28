<template>
    <header>
          {{ uiLabels["enterGameCode"] }}
    </header>
    <body> 
     <p> <input type="number" id="gameCode" v-model="gameCode_data" required="required" > </p>
    <router-link to="Lobby" class="next">{{ uiLabels["joinGame"] }}</router-link>
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
    }
  }
}
</script>

<style>
.next{
  border: 5px solid;
  border-radius: 8px;
  color: red;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
  background-color: #81b8ce;
  text-decoration: none;
}
</style>