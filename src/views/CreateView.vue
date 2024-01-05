<template>
  <header>
    <h1>
      {{ uiLabels["host"] }}
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>
  <div class="wrapper">
    <div class="wrap">
      {{ uiLabels['name_of_host'] }}
      <input ref="nameInput" class="textInputField" type="text" v-model="name" :maxlength="15" @input="checkNameLength"
        :class="{ 'invalid-input': !this.name.length > 0 && buttonClicked }" required>
    </div>
    <div class="custom-alert" v-if="this.showAlert">
      <div class="alert-content">
        {{ uiLabels["tooLongName"] }}
        <a href="https://www.skatteverket.se/privat/folkbokforing/namn.4.18e1b10334ebe8bc80004083.html">
          wwww.skatteverket.se
        </a>
        <button class="closeButton" @click="closeAlert">{{ uiLabels["closePopUp"] }}</button>
      </div>
    </div>
    <div class="wrap2">
      {{ uiLabels["al_pp"] }}
      <div class="plusminus">
        <button class="addRemove" @click="removeAllegation">
          -
        </button>
        {{ numberAllegations }}
        <button class="addRemove" @click="addAllegation">
          +
        </button>
      </div>
    </div>
    <div class="wrap3">
      <div class="themebuttons">
        {{ uiLabels["theme"] }}
        <input type="radio" id="childhood" v-model="theme" name="the_theme" :value="uiLabels['Childhood']" />
        <label class="themes" for="childhood">{{ uiLabels["Childhood"] }}</label>
        <input type="radio" id="illegal" v-model="theme" name="the_theme" :value="uiLabels['Illegal']" />
        <label class="themes" for="illegal">{{ uiLabels["Illegal"] }}</label>
        <input type="radio" id="uti" v-model="theme" name="the_theme" :value="uiLabels['Under the influence']" />
        <label class="themes" for="uti">{{ uiLabels["Under the influence"] }}</label>
        <input type="text" class="otherTheme" v-model="theme" :maxlength="35"
          :class="{ 'invalid-input': (!this.theme.length > 0) && buttonClicked }" required
          :placeholder="uiLabels['enterOwnTheme']" />
      </div>
    </div>
    <div class="lifeline">
      {{ uiLabels["lifeLines"] }}
      <label class="switch">
        <input type="checkbox" @click="toggleButton">
        <span class="slider round"></span>
      </label>
    </div>
  </div>
  <div class="align">
    <router-link to="/" class="back">{{ uiLabels["back"] }}</router-link>
    <button v-on:click="createPoll" class="button">
      {{ uiLabels["cg"] }}
    </button>
  </div>
</template>
  
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      data: {},
      uiLabels: {},
      numberAllegations: 1,
      theme: "",
      isHost: true,
      name: '',
      buttonState: false,
      buttonClicked: false,
      showAlert: false
    }
  },
  mounted() {
    this.$refs.nameInput.focus();
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) => {
      this.data = data
    })
    socket.on("pollCreated", (data) => {
      this.data = data
    })
  },
  methods: {
    checkNameLength() {
      if (this.name.length === 15) {
        this.showAlert = true;
      }
    },
    closeAlert() {
      this.showAlert = false;
    },
    toggleButton() {
      this.buttonState = !this.buttonState;
    },
    createPoll: function () {
      this.buttonClicked = true;
      if (this.name.length && this.theme.length > 0) {
        let gameCode = this.generateGameCode();
        socket.emit("createPoll", { lang: this.lang, gameCode: gameCode, numberAllegations: this.numberAllegations, theme: this.theme, lifeLine: this.buttonState, name: this.name });
        this.$router.push({ name: 'Lobby', params: { gameCode: gameCode, name: this.name, isHost: this.isHost } })
      };
    },

    generateGameCode: function () {
      return Math.floor(Math.random() * 900000 + 100000);
    },
    removeAllegation: function () {
      if (this.numberAllegations > 1) {
        this.numberAllegations--;
      }
    },
    addAllegation: function () {
      if (this.numberAllegations < 8) {
        this.numberAllegations++;
      }
    }
  }
}
</script>
  
<style scoped> 
.wrapper{
  padding-top: 50px;
  color: #2a9451;
  font-size: 20px;
  font-weight: bolder;
  position: relative;
  width: 60%;
  margin: 0 auto;
}
.wrap{
  padding-top: 10px; 
  text-align: left;
}
.wrap > * {
  display: inline-block;
  margin-left: 20px;
}

.wrap2{
  padding-top: 60px; 
  text-align: left;
}
.wrap2 > * {
  display: inline-block;
  margin-left: 20px;
}
.textInputField {
  height: 30px; 
  width: 20em; 
  border-radius: 15px;
  font-size: 14px;
  border: 3px solid #3fbc6a;
  color:#2a9451;
  text-indent: 1em;
}
.wrap3{
  padding-top: 60px; 
}
 .themes {
   border: 3px solid yellow;
   border-radius: 20px;
   color: #2a9451;
   font-size: 12px;
   padding: 10px;
   margin: 10px;
   background-color: #cdf1ff;
   white-space: nowrap;
 }

 .themebuttons input[type="radio"] {
  display: none;
   z-index: 100;
 }

 .themebuttons input[type="radio"]:checked+label,
 .themebuttons label:hover {
   background: yellow;
   cursor: pointer;
 }

 .otherTheme {
   border: 3px solid #3fbc6a;
   border-radius: 20px;
   height: 37px;
   width: 15em;
   font-size: 12px;
   color: #2a9451;
   font-family: monospace;
   text-indent: 1em;
   margin: 8px
 }

 ::placeholder {
   color: #2a9451;
   font-family: monospace;
 }

 .themebuttons {
   display: flex;
   flex-wrap: wrap;
   align-items: center;
 }

 .plusminus {
   margin: auto;
 }

 .addRemove {
   border: 3px solid yellow;
   border-radius: 12px;
   background-color: #cdf1ff;
   width: 30px;
   height: 30px;
   font-size: 22px;
   color: #2a9451;
   line-height: 5px;
   margin: 0 auto;
   cursor: pointer;
 }

 .addRemove:hover {
   background-color: yellow;
 }

 .align {
   padding-top: 20px;
   display: flex;
   justify-content: center;
   gap: 60vw;
 }

 .lifeline {
   padding-top: 30px;
   display: flex;
   margin-bottom: 2em;
   align-items: center;
 }

 .back {
   position: fixed;
   left: 2em;
   bottom: 2em;
 }

 .button {
   width: 150px;
   height: 50px;
   position: fixed;
   right: 2em;
   bottom: 2em;
 }

 .invalid-input {
   border: 3px solid red;
 }

 .switch {
   position: relative;
   display: inline-block;
   width: 60px;
   height: 34px;
   margin-left: 1em;
 }

 .switch input {
   opacity: 0;
 }

 .slider {
   position: absolute;
   cursor: pointer;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: #cdf1ff;
   -webkit-transition: .4s;
   transition: .4s;
 }

 .slider:before {
   position: absolute;
   content: "";
   height: 26px;
   width: 26px;
   left: 4px;
   bottom: 4px;
   background-color: white;
   -webkit-transition: .4s;
   transition: .4s;
 }

 input:checked+.slider {
   background-color: yellow;
 }

 input:focus+.slider {
   box-shadow: 0 0 1px yellow;
 }

 input:checked+.slider:before {
   -webkit-transform: translateX(26px);
   -ms-transform: translateX(26px);
   transform: translateX(26px);
 }

 .slider.round {
   border-radius: 34px;
   border-width: 0.1px;
 }

 .slider.round:before {
   border-radius: 50%;
   border-style: solid;
   border-color: green;
   border-width: 0.1px;
 }

 @media only screen and (max-width: 900px) {
   .wrapper {
     margin-top: -50px;
     text-align: center;
     font-size: 18px;
     width: 80%;
   }

   .textInputField {
     width: 150px;
     margin-top: 1em;
   }

   .wrap {
     padding-top: 30px;
     text-align: center;
     align-content: 0 auto;
     grid-template-columns: 1fr;
   }

   .wrap2 {
     padding-top: 10px;
     text-align: center;
     grid-template-columns: 1fr;
   }

   .wrap3 {
     padding-top: 25px;
     text-align: center;
   }

   .plusminus {
     margin-top: 1em;
   }

   .themebuttons {
     flex-direction: column;
     align-items: center;
   }

   .otherTheme {
     font-size: 12px;
     text-indent: 1.5em;
     margin-left: 0;
     margin: 6px;
   }

   .themes {
     font-size: 12px;
     margin: 6px;
   }

   .button {
     position: relative;
   }

   .back {
     position: relative;
   }

   .lifeline,
   text {
     justify-content: center;
     grid-template-columns: 1fr;
     align-items: center;
     white-space: nowrap;
   }

   .align {
     position: fixed;
     bottom: 0px;
     display: flex;
     align-items: center;
     padding: 30px;
     margin: 0px;
     width: 100%;
     background-color: rgba(236, 236, 236, 0.3);
   }

   .align .button {
     position: fixed;
     right: 30px;
     bottom: 10px;
     height: 45px;
   }

   .align .back {
     position: fixed;
     left: 30px;
     bottom: 10px;
     height: 39px;
     background-color: rgba(236, 236, 236, 0);
   }

   .lifeline {
     padding-bottom: 40px;
   }
 }

</style>
