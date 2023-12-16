<template>
    <header>
      <h1>
        {{ uiLabels["howToPlay"] }}
        <img src="/img/Head_picture.png" class="head_picture">
      </h1>
    </header>

    <body>
    

  
    <div class="liList">
      <li> {{ uiLabels["li1"] }} </li>
      <li> {{ uiLabels["li2"] }} </li>
      <li> {{ uiLabels["li3"] }} </li>
      <li> {{ uiLabels["li4"] }} </li>
    </div>

    <br>
      <br>
      <br>
      <br>

      <h3> {{ uiLabels["50/50"] }} </h3>
      <h3> {{ uiLabels["sneakPeak"] }}</h3>


      <button v-on:click="clue1" class="clues"> 50/50</button>
      <br>
      <br>
      <button v-on:click="clue1" class="clues"> Sneak peak</button>
      <br>
      <router-link to="/" class="back">{{ uiLabels["back"] }}</router-link>

    </body>

    
  

</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'HowToPlayView',
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
    }
  }
}
</script>

<style scoped>

.liList {
  padding-top: 50px;
}

body {
  height: 40em;
  padding-left: 10%;
  padding-top: 25px;
}

li {
  list-style: none;
  background: url('/img/Bullet_points.png') no-repeat 0 center;
  background-size: 1.8em;
  padding-left: 50px;
  margin-bottom: 30px;
  text-align: left;
  font-size: 20px;
}

h3 {
  text-align: left;
  padding-left: 300px;

}

.clues {
  width: 200px; 
  height: 50px; 
  border-radius: 25px; 
  background-color: yellow;
  border: 6px solid green;
  text-align: center;
  color: red; 
  display: inline-block;
  font-size: 20px;
  position: relative;
  top: -130px; 
  
}

.back{
  margin-top: -200px;
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  li {
  font-size: 15px;
  background-size: 40px;
}


}


</style>
