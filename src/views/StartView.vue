<template>
  <header>
    <!--<div v-bind:class="['hamburger', {'close': !hideNav}]" 
         v-on:click="toggleNav">
    </div>
    <div class="logo">
      <img src="/img/logo.png">
      Allegations
      <img src="img/alligatorStart.png">
    </div>-->
    <div class="logo">
      <button v-on:click="switchLanguage">
      <img :src="uiLabels['changeLanguage']">
    </button>
    </div>
  </header>
  <body>
    <disp id="frontText">
      <h2>Allegations</h2>
      <p>where confessions are made</p> 
    <img  src="img/alligatorStart.png" style="width:400px; height:250px;" >
    </disp>
    <disp class=wrapper>
      <button class="button" style="grid-area:a;" >
        <p>Host game</p>
      </button>
      <button class="button" style="grid-area:b;">
        <p>Join game</p>
      </button>
      <button class="button" style="grid-area:d">
        <p>How to play</p>
      </button>
     </disp>

    
    
  </body>
  <!--<ResponsiveNav v-bind:hideNav="hideNav">
    <button v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>
    <router-link to="/create/">{{uiLabels.createPoll}}</router-link>
    <router-link to="/HowToPlayView/">{{uiLabels.regler}}</router-link>
    <router-link to="/hostgame/">{{uiLabels.host}}</router-link>
    </ResponsiveNav>
  <h1>{{ uiLabels["sales-pitch"] }}</h1>
  <h2>{{ uiLabels.subHeading }}</h2>
  <label>
    Write poll id: 
    <input type="text" v-model="id">
  </label>
  <router-link v-bind:to="'/poll/'+id">{{uiLabels.participatePoll}}</router-link> -->
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
  header {
    background-color: #81b8ce ;
    width: 100%;
    /* display: grid; */
    /* grid-template-columns: 2em auto; */
    text-align: right;
  }
  .logo {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 2.5rem;
    color: white;
    padding-top:0.2em;
  }
  .logo img {
    height:2.5rem;
    vertical-align: bottom;
    margin-right: 0.5rem; 
  }
  .hamburger {
    color:white;
    width:1em;
    display: flex;
    align-items: center;
    justify-content: left;
    padding:0.5rem;
    top:0;
    left:0;
    height: 2rem;
    cursor: pointer;
    font-size: 1.5rem;
  }

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hamburger::before {
    content: "☰";
  }
  .close::before {
    content: "✕";
  }
  .hide {
    left:-12em;
  }
}
body{
    background-color: #81b8ce; 
  }
#frontText{
  color: green; 
  text-align: center;
}
.wrapper{
  display: grid; 
  grid-gap: 10px;
  grid-template: 
  "a b" 40px 
  "c d" 40px / 1fr 1fr;
}
/* .button { 
  background-color:green;
  color:yellow;
  text-align: center; 
}*/
</style>
