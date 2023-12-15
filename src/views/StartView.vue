<template>
  <header>
      <button v-on:click="switchLanguage" id="language_button">
      <img :src="uiLabels['changeLanguage']" id="language_button">
      </button>
  </header>
  <body>
    <div id="frontText">
      <h2>ALLEGATIONS</h2>
      <h4>{{ uiLabels['sales-pitch'] }}</h4> 
    <img  src="img/alligatorStart.png" id="startpage_picture">
    </div>
    <disp class=wrapper>
     <router-link to="/create/" class="button" style="grid-area:a;">{{uiLabels.host}}</router-link>
     <router-link to="/JoinGameCode/" class="button" style="grid-area:b;">{{uiLabels.joinGame}}</router-link>
    </disp>

    <disp class=rightButton>
    <router-link to="/HowToPlayView/" class="button" style="grid-area:d;">{{uiLabels.howToPlay}}</router-link>
    </disp>

  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
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
  }
}
</script>

<style scoped>
  header {
    background-color: #81b8ce ;
    width: 100%;
    text-align: right;
  }

  .wrapper{
  display: flex;
  justify-content: center;
  gap: 20px; 
  margin-top: 10px;
}

.rightButton{
  display: flex;
  justify-content: right;
  margin-top: 20px;
}

h4{
  font-size: 2.0vw;
  letter-spacing: 0.3vw;
}

@media screen and (max-width:50em) {
.rightButton{
  justify-content: center;
}
.button{
  width: 18vw; 
  height: 6vh; 
}}


body{
    background-color: #81b8ce; 
  }

#frontText{
  color: #2a9451; 
  text-align: center;
}

#language_button {
  border: none;
  background: none;
  margin-top: 5px;
  margin-right: 5px;
}

#language_button:hover {
      cursor: pointer;
    }

#startpage_picture {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width:400px; 
  height:250px;
}
</style>
