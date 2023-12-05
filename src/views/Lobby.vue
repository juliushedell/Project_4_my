<template>
  <body>
    <header> 
        <h1>
            Lobby
            <img src="/img/Head_picture.png" class="head_picture">
        </h1>
    </header>
    <h2 id="gameCode">
      {{ this.gameCode }}
    </h2>
    <h3 id="theme">
      {{ poll.theme }}
    </h3>
    <br>
      <!-- skapar fields till confessions -->
      <div id="parent-container">
      <form id="confessionsform">
        <div>
          <div v-for="i in poll.numberAllegations" :key="i">
            <label for="confession{{ i }}"> Allegation {{ i }} :  </label>
            <input type="text" class="field" id="field{{ i }}" v-model="conf[i]" required="required" :placeholder="uiLabels.enterAllegations">
            <br><br>
          </div>
        </div>
      </form>
    </div>
      <!-- knapp som skickar confessions till submitConfessions  -->
      <div class="wrap">
         <!--knapp som går bakåt -->
         <router-link to="/Create/" class="back" >{{ uiLabels["back"] }}</router-link>
        <button class= "button" v-on:click="submitConfessions">
          <h3>Submit</h3> 
        </button>
      </div>  
      <br>
      {{ poll }}
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
    hideNav: true,
    // lagrar confessions i array?
    conf:{},
    poll: {},
    gameCode: 0
  }
},
created: function () {
  this.gameCode = this.$route.params.pollId
  socket.emit("pageLoaded", this.lang);
  socket.emit("getPoll", this.gameCode);
  socket.on("pullPoll", (poll) => {
    this.poll = poll
  })
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
  return Math.floor(Math.random() * 1000000);
  },
  submitConfessions: function() {
  this.conf.push(this.confession);
  socket.emit("addConfessions", {gameCode: this.gameCode, conf: this.conf});
  }
 }
}
</script>


<style>

#gameCode {
  text-align: center;
  margin-top: 0.3em;
}
.field{
  border-radius: 8px;
  color: black;
  font-size: 20px;
}
#parent-container {
  text-align: center; 
}
#confessionsform {
  font-size: 30px;
  color: #2a9451;
  font-weight: bold;
  display: inline-block; 
}
.button{
  width: 200px; 
  height: 75px;
  font-size: 30px;
  margin-left: auto;
}
#theme{
  text-align: center;
}

.wrap{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 50px 0px 50px;
}

</style>