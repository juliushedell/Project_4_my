<template>
  <header>
    <h1>
      {{ uiLabels["joinGame"] }}
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>
  <div class="initialText">
    <label for="gameCode"> {{ uiLabels["explain"] }} </label>
  </div>
  <div id="codeField">
    <input ref="gameCodeInput" type="number" id="gameCode" v-model="gameCode" @keyup.enter="checkPollId" required>
  </div>
  <div class="wrapper">
    <router-link to="/" class="back">{{ uiLabels["back"] }}</router-link>
    <button @click="checkPollId" class="button">{{ uiLabels["joinGame"] }}</button>
  </div>
  <div class="custom-alert" v-if="this.showAlertEnterCode">
    <div class="alert-content">
      {{ uiLabels["enterGameCode"] }}
      <br><br>
      <button class="closeButton" @click="closeAlertEnterCode">{{ uiLabels["closePopUp"] }}</button>
    </div>
  </div>
  <div class="custom-alert" v-if="this.showAlertDontExist">
    <div class="alert-content">
      {{ uiLabels["notAGame"] }}
      <br><br>
      <button class="closeButton" @click="closeAlertDontExist">{{ uiLabels["closePopUp"] }}</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'JoinGameCode',
  data: function () {
    return {
      gameCode: null,
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      showAlertEnterCode: false,
      showAlertDontExist: false
    }
  },
  mounted() {
    this.$refs.gameCodeInput.focus();
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("isGameCodeOK", (gameExists) => {
      if (!gameExists) {
        this.showAlertDontExist = true;
      } else {
        this.$router.push({ name: 'JoinGameName', params: { gameCode: this.gameCode } });
      }
    });
  },

  methods: {
    checkPollId() {
      if (!this.gameCode) {
        this.showAlertEnterCode = true;
      }
      else {
        socket.emit("checkGameCode", this.gameCode);
      }
    },
    closeAlertEnterCode() {
      this.showAlertEnterCode = false;
    },
    closeAlertDontExist() {
      this.showAlertDontExist = false;
    }
  }
}
</script>

<style scoped>
#codeField {
  text-align: center;
}

#gameCode {
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
}

#gameCode::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.initialText {
  margin-top: 100px;
  font-size: 20px;
  color: #2a9451;
  font-family: monospace;
  font-weight: bolder;
  text-align: center;
}

@media screen and (max-width:50em) {
  .head_picture {
    height: 50px;
    margin: 10 10 0 0;
  }
}

</style>
