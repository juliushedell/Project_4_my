<template>
    <div id="app"> 
        <header> 
            <h1>
                Host game
            </h1>
            <img src="pullerPoint.png" alt="Alligator" class="header-image">
        </header>
    </div>
    <body>
        <li>Name of host: </li>
        <input type="text" v-model="name_of_host" class="text">
        <li>Allegations per player</li>
        <input type="number" v-model="no_allegations" class="text">
        <li>Theme: </li>
        <div>
          <button v-on:click="ch" class="themes">
            Childhood
          </button>
          <button v-on:click="ill" class="themes">
            Illegal
          </button>
          <button v-on:click="uti" class="themes">
            Under the influence
          </button>
          <button v-on:click="create_own" class="themes">
            Create you own theme
          </button>
        </div>
        <br>
        <button v-on:click="back" class="back">
          <router-link to="/back/">Back</router-link>
        </button>
        <button v-on:click="create" class="create_game">
          Create game
        </button>
    </body>

</template>





  
  <script>
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
    name: 'CreateView',
    data: function () {
      return {
        lang: localStorage.getItem("lang") || "en",
        pollId: "",
        question: "",
        answers: ["", ""],
        questionNumber: 0,
        data: {},
        uiLabels: {}
      }
    },
    created: function () {
      this.id = this.$route.params.id;
      socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels
      })
      socket.on("dataUpdate", (data) =>
        this.data = data
      )
      socket.on("pollCreated", (data) =>
        this.data = data)
    },
    methods: {
      createPoll: function () {
        socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      },
      addQuestion: function () {
        socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
      },
      addAnswer: function () {
        this.answers.push("");
      },
      runQuestion: function () {
        socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
      }
    }
  }
  </script>

<style scoped>
#app {
  background-color: #81b8ce; /* Set the background color for the entire component */
}

h1 {
  background-color: green;
  color: yellow;
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
  height: 40em;
  padding-left: 10%;
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
}

.back{
  border: 5px solid;
  border-radius: 8px;
  color: red;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
  background-color: #81b8ce;
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

</style>

  