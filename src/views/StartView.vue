<template>
  <header>
    <div id="languageWrapper">
      <button v-on:click="switchLanguageEnglish" id="language_button">
      <img src="img/britishFlagga.png" id="language_button">
      </button>
      <button v-on:click="switchLanguageSwedish" id="language_button">
      <img src="img/svenskFlagga.png" id="language_button">
      </button>
    </div>
  </header>
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
</template>

<script>
import io from 'socket.io-client';
// sessionStorage.setItem("dataServer", "192.168.1.209:3000")
sessionStorage.setItem("dataServer", "localhost:3000")
const socket = io(sessionStorage.getItem("dataServer"));

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
    switchLanguageEnglish: function() {
      this.lang = "en"
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    },
    switchLanguageSwedish: function() {
      this.lang = "sv"
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
  padding-right: 5px;
}

h2 {
  font-size: 3vw;
  font-family: monospace;
  letter-spacing: 0.4vw;
}

h4{
  font-size: 1.5vw;
  font-family: monospace;
  letter-spacing: 0.1vw;
}

body{
    background-color: #81b8ce; 
  }

#frontText{
  color: #2a9451;
  font-family: monospace; 
  text-align: center;
}

#language_button {
  border: none;
  background: none;
  width: 80px;
  height: 40px;
}

#languageWrapper {
  display: flex;
  justify-content: right;
  gap: 10px;
  margin-top: 20px;
  margin-right: 30px;
}

#language_button:hover {
      cursor: pointer;
    }

#startpage_picture {
  margin-bottom: 10px;
  width:400px; 
  height:250px;
}

.button {
  height: 25px;
}

@media screen and (max-width:50em) {
.rightButton{
  justify-content: center;
}
.button{
  width: 18vw; 
  height: 6vh; 
}

h2 {
  font-size: 26px;
  font-family: monospace;
  letter-spacing: 2px;
} 

h4{
  font-size: 13px;
  font-family: monospace;
letter-spacing: 1.0px;
}

#startpage_picture {
  width: 266px;
  height: 166px;
}}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  h2 {
  padding-top: 75px;
} 

  #startpage_picture {
  margin-bottom: 20px;
  width:177,8px; 
  height:111,1px;
}

.button{
  width: 30vw; 
  height: 6vh; 
}}



</style>
