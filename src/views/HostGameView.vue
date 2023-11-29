<template>
  <div id="app"> 
      <header> 
          <h1>
              Host game
              <img src="/img/Head_picture.png" class="head_picture">
          </h1>
      </header>
  </div>
  <body>
    <div class="wrap">
      {{ uiLabels["name_of_host"] }}
      <input type="text" v-model="name_of_host" class="text">
    </div>
    <div class="wrap">
      {{ uiLabels["al_pp"] }}
      <input type="number" v-model="no_allegations" class="text">
    </div>
      <li>{{ uiLabels["theme"] }}</li>


  <div class="themebuttons">
      <input type="radio" id="childhood" v-model="the_theme" value="Childhood"/>
      <label class="themes" for="childhood">{{ uiLabels["childhood"] }}</label>
      <input type="radio" id="illegal" v-model="the_theme" value="Illegal"/>
      <label class="themes" for="illegal">{{ uiLabels["illegal"] }}</label>
      <input type="radio" id="uti" v-model="the_theme" value="Under the influence"/>
      <label class="themes" for="uti">{{ uiLabels["uti"] }}</label>
      <input type="radio" id="other" v-model="the_theme"/>
      <label class="themes" for="other">{{ uiLabels["yourOwnTheme"] }}</label>
      <input type="text" id="otherTheme" v-model="the_theme" />
  </div>

      <br>
      <router-link to="/" class="back" >{{ uiLabels["back"] }}</router-link>
      <button v-on:click="createGame" class="create_game" type="submit">
        {{ uiLabels["cg"] }}
      </button>


</body>


</template>






<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
name: 'HostGameView',
data: function () {
  return {
    uiLabels: {},
    data: {},
    game_id: "",
    lang: localStorage.getItem("lang") || "en",
    name_of_host: '',
    no_allegations: 0,
    the_theme: ""
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

  // socket.on("gameCreated", (data) =>
  //   this.data = data)
},
methods: {
  createGame: function () {
    socket.emit("createGame", {game_id: this.game_id,
                                 lang: this.lang,
                                 name_of_host: this.name_of_host,
                                 no_allegations: this.no_allegations,
                                 the_theme: this.the_theme})
    console.log(this.name_of_host,this.no_allegations,this.the_theme)
    },
  }
}

</script>

<style scoped>
#app {
background-color: #81b8ce; /* Set the background color for the entire component */
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
height: 70em;
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
text-decoration: none;
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

.wrap{
display: grid;
grid-gap: 5em;
grid-template-columns: repeat(2, 1fr);
}

.themebuttons {
list-style-type: none;
margin: 25px 0 0 0;
padding: 0;
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
</style>


