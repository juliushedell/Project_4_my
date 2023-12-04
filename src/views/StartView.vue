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
     <router-link to="/JoinGameName/" class="button" style="grid-area:b;">{{uiLabels.joinGame}}</router-link>
    </disp>

    <disp class=rightButton>
    <router-link to="/HowToPlayView/" class="button" style="grid-area:d;">{{uiLabels.howToPlay}}</router-link>
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

  .wrapper{
  display: flex;
  justify-content: center;
  gap: 20px; 
  margin-top: 50px;
}

.rightButton{
  display: flex;
  justify-content: right;
  margin-top: 40px;
}

.button{
  margin-top: -75px;
  padding: 20px
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
  .wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
}
.rightButton{
  display: flex;
  align-items: right;
  justify-content: center;
}
.button{
  dispplay: flex;
  width: 9em; /* 150px converted to em based on a 16px reference font size */
  height: 3em; /* 50px converted to em based on a 16px reference font size */
  border-radius: 3.125em; /* 50px converted to em based on a 16px reference font size */
  background-color: #3fbc6a;
  border: 0.1875em solid #2a9451; /* 3px converted to em based on a 16px reference font size */
}
}


body{
    background-color: #81b8ce; 
  }
#frontText{
  color: #2a9451; 
  text-align: center;
}

 /* .button {  
  background-color:green;
  color:yellow;
  text-align: center;
  text-decoration: none; 
}*/

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
  margin-bottom: 100px;
  width:400px; 
  height:250px;
}



</style>
