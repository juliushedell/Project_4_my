<template>
  <div id="languageWrapper">
    <button v-on:click="switchLanguageEnglish" id="language_button">
      <img src="img/britishFlagga.png" id="language_button">
    </button>
    <button v-on:click="switchLanguageSwedish" id="language_button">
      <img src="img/svenskFlagga.png" id="language_button">
    </button>
  </div>
  <div id="frontText">
    <h2>ALLEGATIONS</h2>
    <h4>{{ uiLabels['sales-pitch'] }}</h4>
    <img src="img/alligatorStart.png" id="startpage_picture">
  </div>
  <nav class=wrapper>
    <router-link to="/create/" class="button" style="grid-area:a;">{{ uiLabels.host }}</router-link>
    <router-link to="/JoinGameCode/" class="button" style="grid-area:b;">{{ uiLabels.joinGame }}</router-link>
  </nav>
  <div class=rightButton>
    <router-link to="/HowToPlayView/" class="button" style="grid-area:d;">{{ uiLabels.howToPlay }}</router-link>
  </div>
</template>

<script>
import io from 'socket.io-client';
sessionStorage.setItem("dataServer", "172.20.10.2:3000") // Julius IP 
// sessionStorage.setItem("dataServer", "localhost:3000")
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
    switchLanguageEnglish: function () {
      this.lang = "en"
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    },
    switchLanguageSwedish: function () {
      this.lang = "sv"
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    },
  }
}
</script>

<style scoped>
#languageWrapper {
  display: flex;
  justify-content: right;
  gap: 10px;
  margin-top: 20px;
  margin-right: 30px;
}

#language_button {
  border: none;
  background: none;
  width: 80px;
  height: 40px;
}

#language_button:hover {
  cursor: pointer;
}

#frontText {
  color: #2a9451;
  font-family: monospace;
  font-size: 20px;
  text-align: center;
}

#frontText h2{
  font-size: 70px;
  margin: 0.2em auto;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #28834a;
}
#frontText h4{
  font-size: 18px;
  margin-top: 0;
  animation: fadeIn 5s;
  -webkit-animation: fadeIn 5s;
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.wrapper {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.rightButton {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  padding-right: 5px;
}

body {
  background-color: #81b8ce;
}

#startpage_picture {
  margin-bottom: 10px;
  width: 400px;
  height: 250px;
}

.button {
  height: 25px;
}

@media screen and (max-width:50em) {
  .rightButton {
    justify-content: center;
  }

  .button {
    width: 18vw;
    height: 6vh;
  }

  #startpage_picture {
    width: 266px;
    height: 166px;
  }
  #frontText h2{
    font-size: 50px;
  }
  #frontText h4{
    font-size: 18px;
  }
  #frontText {
    margin: 2em 0 2em;
  }

}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  h2 {
    padding-top: 75px;
    font-size: 26px;
    font-family: monospace;
    letter-spacing: 2px;
  }

  h4 {
    font-size: 13px;
    font-family: monospace;
    letter-spacing: 1.0px;
  }

  #startpage_picture {
    margin-bottom: 20px;
  }

  .button {
    width: 30vw;
    height: 6vh;
  }
}
</style>