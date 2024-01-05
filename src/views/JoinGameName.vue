<template>
  <div>
    <header>
      <h1>
        {{ uiLabels["Choosename"] }}
        <img src="/img/Head_picture.png" class="head_picture">
      </h1>
    </header>
    <div class="explainingText">
      {{ uiLabels["enterName"] }}
    </div>
    <div class="gameNameField">
      <input ref="nameInput" type="text" id="gameName" v-model="name" @keyup.enter="namePlayer" required="required"
        :maxlength="15" @input="checkNameLength">
    </div>
    <div class="custom-alert" v-if="this.showAlertTooLong">
      <div class="alert-content">
        {{ uiLabels["tooLongName"] }}
        <br><br>
        <a href="https://www.skatteverket.se/privat/folkbokforing/namn.4.18e1b10334ebe8bc80004083.html">
          www.skatteverket.se
        </a>
        <br><br>
        <button class="closeButton" @click="closeAlertTooLong">{{ uiLabels["closePopUp"] }}</button>
      </div>
    </div>
    <div class="wrap">
      <router-link to="/JoinGameCode/" class="back">{{ uiLabels["back"] }}</router-link>
      <button @click="namePlayer" class="button" type="submit">{{ uiLabels["next"] }}</button>
    </div>
  </div>
  <div class="custom-alert" v-if="this.showAlertNameTaken">
    <div class="alert-content">
      {{ uiLabels["nameUsed"] }}
      <br><br>
      <button class="closeButton" @click="closeAlertNameTaken">{{ uiLabels["closePopUp"] }}</button>
    </div>
  </div>
  <div class="custom-alert" v-if="this.showAlert">
    <div class="alert-content">
      {{ uiLabels["hostEndedGame"] }}
      <br><br>
      <button class="closeButton" @click="closeAlert">{{ uiLabels["closePopUp"] }}</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'JoinGameName',
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      name: '',
      gameCode: 0,
      isHost: false,
      player: {},
      poll: {},
      buttonClicked: false,
      showAlertTooLong: false,
      showAlert: false,
      showAlertNameTaken: false
    }
  },
  mounted() {
    this.$refs.nameInput.focus();
  },
  created: function () {
    this.gameCode = this.$route.params.gameCode
    socket.emit("pageLoaded", this.lang);
    socket.emit("getPoll", this.gameCode);
    socket.on("pullPoll", (poll) => {
      this.poll = poll
    })
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    socket.on('endTheGame', () => {
      if (!this.isHost) {
        this.showAlert = true;
      }
    })
  },
  methods: {
    checkNameLength() {
      if (this.name.length === 15) {
        this.showAlertTooLong = true;
      }
    },
    closeAlertTooLong() {
      this.showAlertTooLong = false;
    },
    namePlayer: function () {
      this.buttonClicked = true;
      socket.emit('checkName', { gameCode: this.gameCode, name: this.name });
      socket.on('nameChecked', (checkedName) => {
        if (!checkedName) {
          this.$router.push({
            name: 'Lobby', params: { gameCode: this.gameCode, name: this.name, isHost: this.isHost },
          });
        } else {
          this.showAlertNameTaken = true;
        }
      });
    },
    closeAlertNameTaken() {
      this.showAlertNameTaken = false;
    },
    closeAlert() {
      this.showAlert = false;
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.explainingText {
  margin-top: 100px;
  font-size: 20px;
  color: #2a9451;
  font-weight: bolder;
  text-align: center;
  font-family: monospace;
}

.gameNameField {
  text-align: center;
}

#gameName {
  border-radius: 8px;
  color: #2a9451;
  font-size: 16px;
  font-family: monospace;
  padding: 10px;
  margin: 10px;
}

.button {
  position: absolute;
  right: 50px;
  bottom: 50px;
}

.back {
  position: absolute;
  left: 50px;
  bottom: 50px;
  height: 40px;
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  .wrap {  
    position: fixed;
    bottom: 0px;
    display: flex; 
    align-items: center;
    padding: 30px;
    width: 85%;
    background-color: rgba(236, 236, 236, 0.3);
  }

  .wrap .button {
    right: 30px;
    bottom: 10px;
  }

  .wrap .back {
    left: 30px;
    bottom: 10px;
    height: 39px;
    width: 144px;
    }
}
</style>
