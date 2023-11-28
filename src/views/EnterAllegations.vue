<template>
    <header>
      <h1>
          {{ uiLabels["enterAllegations"] }}
      </h1>
    </header>
    <body> 
    <p>
                            <label for="name">{{ uiLabels["Allegation1"] }}</label><br>
                            <input type="text" id="allegation1" v-model="allegation1_data" required="required">
                        </p>
                        <p>
                            <label for="email">{{ uiLabels["Allegation2"] }}</label><br>
                            <input type="text" id="allegation2" v-model="allegation2_data" required="required">
                        </p>
                        <p>
                            <label for="email">{{ uiLabels["Allegation3"] }}</label><br>
                            <input type="text" id="Allegation3" v-model="allegation3_data_data" required="required">
                        </p>
    </body>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true
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
    },
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    }
  }
}
</script>

<style>
<style scoped>
#app {
  background-color: #81b8ce; /* Set the background color for the entire component */
}

h1 {
  background-color: green;
  color: yellow;
}

.header-image {
    position: center;

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
label {
  color:green
}


</style>