<template>

  <div id="app"> 



    <header>
      <h1>
          How to play
      </h1>
      <img src="pullerPoint.png" alt="Alligator" class="header-image">
    </header>

    <body> 
      <li> The host chooses a theme and how many allegations each player should submit. </li>
      <li> Other players join by pressing “join game”, filling out their name and entering the game code that the host provides. </li>
      <li> The goal of the game is to match the allegations with the correct player as fast as possible. </li>
      <li> There are two lifelines available to be used at will: </li>
    </body>

  </div>
</template>

<script>
export default {

  data() {
    return {

    };
  },
  methods: {

  },
  computed: {

  },

};
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
  background: url('pullerPoint.png') no-repeat 0 center;
  background-size: 2%;
  padding-left: 10px;
  margin-bottom: 10px;
}

</style>
