<template>
  <div>
    {{ uiLabels['name_of_host'] }}
    <input type="text" v-model="name">
  </div>
    <!-- <div>
      Answers:
      <input v-for="(_, i) in answers" 
             v-model="answers[i]" 
             v-bind:key="'answer'+i">
      <button v-on:click="addAnswer">
        Add answer alternative
      </button>
    </div> -->
  <!-- <button v-on:click="numberAllegations">
    What is this button
  </button> -->
  <div>
    {{ uiLabels['al_pp'] }}
  <input type="number" v-model="numberAllegations">
  </div>
  <!-- <button v-on:click="runQuestion">
    Run question
  </button> -->
  <!-- {{data}} -->
  <!-- <router-link v-bind:to="'/result/'+pollId">Check result</router-link> -->
  <div>
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
<router-link to="/" class="back" >{{ uiLabels["back"] }}</router-link>
<button v-on:click="createPoll">
    Create game
</button>
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
    questionNumber: 0,
    data: {},
    uiLabels: {},

    name: "",
    numberAllegations: 0,
    theme: ""
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
    let pollId = this.generateGameCode();
    socket.emit("createPoll", {lang: this.lang, pollId: pollId, name: this.name, numberAllegations: this.numberAllegations, theme: this.theme})
    this.$router.push ('/Lobby/' + pollId)
  },
  addQuestion: function () {
    socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
  },
  addAnswer: function () {
    this.answers.push("");
  },
  runQuestion: function () {
    socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
  },
  generateGameCode: function () {
  return Math.floor(Math.random() * 10000000);
  }
}
}
</script>