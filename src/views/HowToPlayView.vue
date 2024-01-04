<template>
  <header>
    <h1>
      {{ uiLabels["howToPlay"] }}
      <img src="/img/Head_picture.png" class="head_picture">
    </h1>
  </header>
  <div class="liList">
    <li> {{ uiLabels["li1"] }} </li>
    <li> {{ uiLabels["li2"] }} </li>
    <li> {{ uiLabels["li3"] }} </li>
    <li> {{ uiLabels["li4"] }} </li>
  </div>
  <div class="li-list1">
    <p> {{ uiLabels["50/50"] }} </p>
  </div>
  <div class="li-list2">
    <p> {{ uiLabels["sneakPeak"] }}</p>
  </div>
  <router-link to="/" class="back">{{ uiLabels["back"] }}</router-link>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("dataServer"));

export default {
  name: 'HowToPlayView',
  data: function () {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
    }
  },
  created: function () {
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
  },
}
</script>

<style scoped>
.liList {
  margin: 50px 100px 50px 50px;
}

.li-list1 {
  background: url('/img/fifty.png') no-repeat 0 center;
  background-size: 10em;
  margin-left: 100px;
  padding: 5px 0px;
}
.li-list2 {
  background: url('/img/Sneakpeak.png') no-repeat 0 center;
  background-size: 10.2em;
  margin-left: 100px;
  padding: 5px 0px;
}

li {
  list-style: none;
  background: url('/img/Bullet_points.png') no-repeat 0 center;
  background-size: 1.8em;
  padding-left: 50px;
  margin-bottom: 30px;
  text-align: left;
  font-size: 20px;
  font-family: monospace;
}

p {
  padding-left: 175px;
  font-size: 20px;
  font-family: monospace;
}
.back {
  margin: 50px 0 0 10px;
}

@media screen and (max-width:50em) {
  li {
    font-size: 18px;
  }

  p {
    font-size: 18px;
  }
}

@media only screen and (max-width: 2532px) and (orientation: portrait) {
  li {
    font-size: 12px;
    background-size: 40px;
  }
  .liList {
    margin: 30px 0 0 10px;
  }
  .li-list1 {
    background: url('/img/fifty.png') no-repeat 0 center;
    background-size: 7em;
    padding: 5px 0px 5px 0px;
    margin-left: 15px;
  }
  .li-list2 {
    background: url('/img/Sneakpeak.png') no-repeat 0 center;
    background-size: 7em;
    padding: 5px 0px 5px 0px;
    margin-left: 15px;
  }

  p {
    padding-left: 130px;
    font-size: 12px;
  }
  .back {
    width: 120px;
    height: 40px;
  }
}
</style>
