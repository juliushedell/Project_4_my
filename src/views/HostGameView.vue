<template>
    <div id="app"> 
        <header> 
            <h1>
                Host game
                <img src="/img/Head_picture.png" class="head_picture">
            </h1>
        </header>
    </div>
    <body>
      <div class="wrap">
        {{ uiLabels["name_of_host"] }}
        <input type="text" v-model="name_of_host" class="text">
      </div>
      <div class="wrap">
        {{ uiLabels["al_pp"] }}
        <input type="number" v-model="no_allegations" class="text">
      </div>
        <li>{{ uiLabels["theme"] }}</li>
        <div>
          <button v-on:click="ch" class="themes">
            {{ uiLabels["childhood"] }}
          </button>
          <button v-on:click="ill" class="themes">
            {{ uiLabels["illegal"] }}
          </button>
          <button v-on:click="uti" class="themes">
            {{ uiLabels["uti"] }}
          </button>
          <router-link to="/createtheme/" class="themes">{{ uiLabels["cot"] }}</router-link>
        </div>
        <br>
        <router-link to="/back/" class="back">{{ uiLabels["back"] }}</router-link>
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
#app {
  background-color: #81b8ce; /* Set the background color for the entire component */
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
  height: 70em;
}

li {
  list-style: none;
  background-size: 2%;
  padding-left: 10px;
  margin-bottom: 10px;
}

.themes{
  border: 5px solid;
  border-radius: 8px;
  color: green;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
  background-color: #81b8ce;
  text-decoration: none;
}

.back{
  border: 5px solid;
  border-radius: 8px;
  color: red;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
  background-color: #81b8ce;
  text-decoration: none;
}

.create_game{
  border: 5px solid;
  border-radius: 8px;
  color: green;
  font-size: 20px;
  padding: 15px;
  margin: 10px;
  background-color: #81b8ce;
}

.text{
  border-radius: 8px;
  color: green;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
}

.wrap{
  display: grid;
  grid-gap: 5em;
  grid-template-columns: repeat(2, 1fr);
}

</style>

  