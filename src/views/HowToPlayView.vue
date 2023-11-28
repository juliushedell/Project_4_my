<template>

  <div id="app"> 



    <header>
      <h1>
        {{ uiLabels["howToPlay"] }}
      </h1>
      <img src="pullerPoint.png" alt="Alligator" class="header-image">
    </header>

    <body> 
      <li> {{ uiLabels["li1"] }} </li>
      <li> {{ uiLabels["li2"] }} </li>
      <li> {{ uiLabels["li3"] }} </li>
      <li> {{ uiLabels["li4"] }} </li>
    </body>

  </div>
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
#app {
  background-color: #81b8ce; /* Set the background color for the entire component */
}

h1 {
  background-color: green;
  color: yellow;
}

.header-image {
    position: absolute;
    top: 0;
    right: 0;
    max-width: 100px; /* Set the max width of the image */
    height: auto;
}

header {
  background-color: #81b8ce;
}

body {
  background-color: #81b8ce;
  height: 40em;
  padding-left: 10%;
}

li {
  list-style: none;
  background: url('pullerPoint.png') no-repeat 0 center;
  background-size: 2%;
  padding-left: 10px;
  margin-bottom: 10px;
}

</style>
