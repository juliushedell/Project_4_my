<template>
    <div id="app"> 
        <header> 
            <h1>
                {{ uiLabels["createOwnTheme"] }}
            </h1>
            <img src="pullerPoint.png" alt="Alligator" class="header-image">
        </header>
    </div>
    <body>
        <div class="wrap">
            {{ uiLabels["eyt"] }}
            <input type="text" v-model="name_of_host">
        </div>
        <router-link to="/HostGame/" class="backk">{{ uiLabels["back"] }}</router-link>
        <button v-on:click="create" class="create_game">
          {{ uiLabels["cg"] }}
        </button>
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

<style scoped>
.wrap{
  display: grid;
  grid-gap: 5em;
  grid-template-columns: repeat(2, 1fr);
}
</style>