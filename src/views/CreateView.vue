<template>

  <header>
    <h1>
      {{ uiLabels["host"] }}
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>
  
  
  
    <div clas=wrapper>
      {{ uiLabels['name_of_host'] }}
      <input type="text" v-model="name" required>
   
        {{ uiLabels['al_pp'] }}
        <input type="number" min="1" max="8" v-model="numberAllegations">
    </div>
  
    <div class=themeTitle>
      {{ uiLabels["theme"] }}
    </div>
  
  <div class="themebuttons">
      <input type="radio" id="childhood" v-model="theme" name="the_theme" value="Childhood"/>
      <label class="themes" for="childhood">{{ uiLabels["childhood"] }}</label>
      <input type="radio" id="illegal" v-model="theme" name="the_theme" value="Illegal"/>
      <label class="themes" for="illegal">{{ uiLabels["illegal"] }}</label>
      <input type="radio" id="uti" v-model="theme" name="the_theme" value="Under the influence"/>
      <label class="themes" for="uti">{{ uiLabels["uti"] }}</label>
      <input type="radio" id="other" v-model="theme" name="the_theme"/>
      <label class="themes" for="other">{{ uiLabels["yourOwnTheme"] }}</label>
      <input type="text" id="otherTheme" v-model="theme"/>
  </div>
  
  <button v-on:click="createPoll" class="buttonCreate">
      Create game
  </button>
  
  <router-link to="/" class="back" >{{ uiLabels["back"] }}</router-link>
  
  
  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      question: "",
      answers: ["", ""],
      data: {},
      uiLabels: {},
  
      name: "",
      numberAllegations: 0,
      theme: "",
      allegations: []
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
      this.data = data
    )
    socket.on("pollCreated", (data) => {
      this.data = data
      console.log(data)
    }
      )
  },
  methods: {
    createPoll: function () {
      let gameCode = this.generateGameCode();
      socket.emit("createPoll", {lang: this.lang, gameCode: gameCode, name: this.name, numberAllegations: this.numberAllegations, theme: this.theme, allegations: this.allegations})
      socket.emit('createPlayer', {lang: this.lang, gameCode: gameCode, name: this.name, isHost: true})
      this.$router.push ('/Lobby/' + gameCode)
    },
    addQuestion: function () {
      socket.emit("addQuestion", {gameCode: this.gameCode, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {gameCode: this.gameCode, questionNumber: this.questionNumber})
    },
    generateGameCode: function () {
    return Math.floor(Math.random() * 1000000);
    }
  }
  }
  </script>
  
  <style scoped>
  .wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    min-height: 100vh;
  }
  
  .themeTitle{
    display: flex;
    justify-content: center;
    font-size: 30px;
    color: green; 
  }
  
  .themes{
  border: 3px solid yellow;
  border-radius: 20px;
  color: green;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
  background-color: #81b8ce;
  text-decoration: none;
  }
  
  .themebuttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  
  .themebuttons input[type="radio"] {
  opacity: 0.01;
  z-index: 100;
  }
  
  .themebuttons input[type="radio"]:checked+label,
  .Checked+label {
  background: yellow;
  }
  
  .themebuttons label:hover {
  background: yellow;
  }
  
  #otherTheme{
    height: 50px; 
    width: 150px; 
    border-radius: 15px;
    font-size: 14px;
  
  }
  
  .back{
    line-height: 30px;
    border-width: 3px;
    width: 100px;
    height: 30px;
    margin-left: 20px;
    font-size: 14px;
    margin-top: 10px;
  }
  
  .buttonCreate{
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
  
  @media screen and (max-width:50em) {
    .themebuttons{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .themeTitle{
      display: flex; 
      align-items: center;
      justify-content: center;
    }
  
    .buttonCreate{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  
  </style>