<template>
    <body>
<p> Lobby: displaying game code and entered players </p>


<div>
  <div v-for="(d, key) in dengrejen" 
       v-bind:style="{ left: order.details.x + 'px', 
                       top: order.details.y + 'px'}" 
       v-bind:key="'dots' + key">
    {{ key }}
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
    generateGameCode: function () {
    return Math.floor(Math.random() * 100000);
  }
  }
}
</script>


<style>
</style>