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
      <input class="textInputField" type="text" v-model="name" :maxlength="15" @input="checkNameLength" required>
   </div>
    <div class="wrap" style="grid-area: b;" >
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
      <label class="themes" for="childhood">{{ uiLabels["childhood"] }}</label>
      <input type="radio" id="illegal" v-model="theme" name="the_theme" value="Illegal"/>
      <label class="themes" for="illegal">{{ uiLabels["illegal"] }}</label>
      <input type="radio" id="uti" v-model="theme" name="the_theme" value="Under the influence"/>
      <label class="themes" for="uti">{{ uiLabels["uti"] }}</label>
      <!-- <input type="radio" id="other" v-model="theme" name="the_theme" value=""/>
      <label class="themes" for="other">{{ uiLabels["yourOwnTheme"] }}</label> -->
      <p class="ot">{{ uiLabels["yourOwnTheme"] }}</p>
      <input type="text" id="otherTheme" v-model="theme"/>
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
      if (this.name.length === 15) {
        alert('Change name: https://www.skatteverket.se/privat/folkbokforing/namn.4.18e1b10334ebe8bc80004083.html');
      }
    },
    createPoll: function () {
  let gameCode = this.generateGameCode();
  socket.emit("createPoll", { lang: this.lang, gameCode: gameCode, numberAllegations: this.numberAllegations, theme: this.theme });
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
  flex-direction: column;
  align-items: center;
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
  font-size: 28px;
  color: #2a9451;
  gap: 50px;
}

.textInputField {
  height: 30px; 
  width: 300px; 
  border-radius: 15px;
  font-size: 14px;


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
  
.themebuttons label:hover {
  background:yellow;
  }
  
#otherTheme{
  height: 30px; 
  width: 150px; 
  border-radius: 15px;
  font-size: 14px;
}

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
}

.minus:hover{
  background-color: ;
}

.ot {
  color: #2a9451;
  font-size: 18px;
  padding-right: 8px;
}
.align {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 50px 0px 50px;
  gap: 100px;
}
</style>