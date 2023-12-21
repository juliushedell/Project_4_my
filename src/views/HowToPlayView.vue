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
const socket = io("localhost:3000");

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
  methods: {
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem("lang", this.lang);
      socket.emit("switchLanguage", this.lang)
    }
  }
}
</script>

<style scoped>
body {
  height: 40em;
  padding-left: 10%;
  padding-top: 25px;
}
.liList {
  margin-top: 50px;
  margin-left: 100px;
  margin-right: 50px;
  margin-bottom: 50px;
}
.li-list1 {
  background: url('/img/fifty.png') no-repeat 0 center;
  background-size: 10em;
  margin-left: 100px;
  padding: 5px 0px 5px 0px
}

.li-list2 {
  background: url('/img/Sneakpeak.png') no-repeat 0 center;
  background-size: 10em;
  margin-left: 100px;
  padding: 5px 0px 5px 0px
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
  text-align: left;
  padding-left: 250px;
  font-size: 20px;
}

.back {
  margin-top: 50px;
  margin-left: 10px;
}


@media only screen and (max-width: 2532px) and (orientation: portrait) {
  li {
  font-size: 16px;
  background-size: 40px;
} 

.liList {
  padding-top: 20px;
  margin-bottom: 10px;
}
.li-list1 {
  background: url('/img/fifty.png') no-repeat 0 center;
  background-size: 7em;
  padding: 5px 0px 5px 0px
}

.li-list2 {
  background: url('/img/Sneakpeak.png') no-repeat 0 center;
  background-size: 7em;
  padding: 5px 0px 5px 0px
}
p {
  text-align: left;
  padding-left: 130px;
  font-size: 16px;
}

body {
  height: 40em;
  padding-left: 10%;
  padding-top: 25px;
  margin-right: 10px;
}

.back {
  width:120px;
  height:40px;
}
}


</style>
