<template>

  <header>
    <h1>
      {{ uiLabels["host"] }}
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>
  
  <div class="wrapper">
    <div class="wrap" style="grid-area: a;">
      {{ uiLabels['name_of_host'] }}
      <input class="textInputField" type="text" v-model="name" :maxlength="15" @input="checkNameLength" :class="{'invalid-input': !nameEntered && buttonClicked}" required>
   </div>
    <div class="wrap2" style="grid-area: b;" >
      {{ uiLabels["al_pp"] }}

      <div class="plusminus"  >
      <button class="minus" @click="removeAllegation">
        -
      </button>
      {{numberAllegations}}
      <button class="plus" @click="addAllegation">
        +
      </button>
    </div>
    </div>

  </div>
    <div class=themeTitle>
      {{ uiLabels["theme"] }}
    </div>
  
  <div class="themebuttons">
      <input type="radio" id="childhood" v-model="theme" name="the_theme" value="Childhood"/>
      <label class="themes" for="childhood">{{ uiLabels["Childhood"] }}</label>
      <input type="radio" id="illegal" v-model="theme" name="the_theme" value="Illegal"/>
      <label class="themes" for="illegal">{{ uiLabels["Illegal"] }}</label>
      <input type="radio" id="uti" v-model="theme" name="the_theme" value="Under the influence"/>
      <label class="themes" for="uti">{{ uiLabels["Under the influence"] }}</label>
      <p class="ot">{{ uiLabels["Own theme: "] }}</p>
      <input type="text" id="otherTheme" v-model="theme"/>
  </div>




  <div class="lifeline">
    <button type="button" class="lifelinebutton" @click="toggleButton" :class="{ active: buttonState }">{{uiLabels["lifeLines"]}}</button>
  </div>

  <div class="align">
    <router-link to="/" class="back" >{{ uiLabels["back"] }}</router-link>
    <button v-on:click="createPoll" class="button">
        {{uiLabels["cg"]}}
    </button>
  </div>
</template>
  
<script>
  import io from 'socket.io-client';
  const socket = io("localhost:3000");
  
  export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
      numberAllegations: 1 ,
      theme: "",
      isHost: true,
      name: '',
      buttonState: false,
      nameEntered: false,
      buttonClicked: false
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
    }
      )
  },
  methods: {
    checkNameLength() {
      this.nameEntered = this.name.length > 0;
      if (this.name.length === 15) {
        alert(this.uiLabels['tooLongName'] + 'https://www.skatteverket.se/privat/folkbokforing/namn.4.18e1b10334ebe8bc80004083.html');
      }
    },
    toggleButton() {
      this.buttonState = !this.buttonState;
      
    },
    createPoll: function () {
      this.buttonClicked = true;
  let gameCode = this.generateGameCode();
  socket.emit("createPoll", { lang: this.lang, gameCode: gameCode, numberAllegations: this.numberAllegations, theme: this.theme, lifeLine: this.buttonState });
  this.$router.push({ name: 'Lobby', params: { gameCode: gameCode, name: this.name, isHost: this.isHost } });
  },

    generateGameCode: function () {
    return Math.floor(Math.random() * 900000 + 100000);
    },
      removeAllegation: function(){
    if (this.numberAllegations > 1){
      this.numberAllegations --;
     }
    }, 
    addAllegation: function(){
      if (this.numberAllegations < 8){
      this.numberAllegations ++;
      }
    }
   }
  }
</script>
  
<style scoped> 
.wrapper{
  justify-content: center;
  padding-top: 50px;
  display: grid;
  grid-template-areas: 
  'a a'
  'b c';
  color: #2a9451;
  font-size: 28px;
  font-weight: bolder;
  text-align: center;
}
.wrap{
  padding-top: 40px; 
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.wrap2{
  padding-top: 40px; 
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.textInputField {
  height: 30px; 
  width: 300px; 
  border-radius: 15px;
  font-size: 14px;
  border: 3px solid yellow;
  color:#2a9451;
}

.themeTitle{
  padding-top: 60px;
  font-size: 28px;
  font-weight: bolder;
  color: #2a9451;
}
  
.themes{
  border: 3px solid yellow;
  border-radius: 20px;
  color: #2a9451;
  font-size: 16px;
  padding: 10px;
  margin: 10px;
  background-color: #81b8ce;
}  
.themebuttons input[type="radio"] {
  opacity: 0.01;
  z-index: 100;
  }
  
.themebuttons input[type="radio"]:checked+label,
  
.themebuttons label:hover {
  background:yellow;
  }
  
#otherTheme{
  border: 3px solid yellow;
  height: 30px; 
  width: 150px; 
  border-radius: 15px;
  font-size: 14px;
  color:#2a9451;
}

.themebuttons{
  display: flex;
  align-items: center;
  justify-content: center;
}
.themeTitle{
  display: flex; 
  justify-content: center;
}
.plusminus {
  width: 300px;
}
.plus {
  border: 3px solid yellow;
  border-radius: 12px;
  background-color: #81b8ce;
  width: 30px;
  height: 30px;
  font-size: 22px;
  color: #2a9451;
  line-height: 20px;
}
.plus:hover {
  background-color: yellow;
}
.minus {
  border: 3px solid yellow;
  border-radius:12px;
  background-color: #81b8ce;
  width: 30px;
  height: 30px;
   font-size: 22px;
  color: #2a9451; 
  line-height: 5px;
}

.minus:hover{
  background-color: yellow;
}

.ot {
  color: #2a9451;
  font-size: 18px;
  padding-right: 8px;
}

.align {
  padding-top: 20px;
  display: flex;
  justify-content: center;
  gap: 60vw;
}
.lifelinebutton {
  border: 3px solid yellow;
  border-radius: 20px;
  color: #2a9451;
  font-size: 16px;
  padding: 10px;
  background-color: #81b8ce;
}
.lifelinebutton.active {
  background: yellow;
}
.lifeline {
  padding-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  width: 250px;
}
.invalid-input {
  border: 3px solid red; /* Change red to your desired color */
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  .wrapper {
    margin-top: -50px; 
  }
  .textInputField {
    width: 150px;
  }
  .wrap {
    font-size: 20px;
    padding-left: 20px;
  }
  .wrap2 {
    font-size: 20px;
    padding-left: 80px;
  }
  .themeTitle {
    margin-top: -40px;
    font-size: 20px;
  }
  .themebuttons {
    flex-direction: column;
    align-items: center;
  }

  #otherTheme {
    margin-top: 10px;
  }

  .align{
    margin-top: 20px;
    gap: 40px;
  }

  .button {
  width: 170px;
}
}

</style>