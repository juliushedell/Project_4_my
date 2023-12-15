<template>
 <!-- Till denna sidan måste vi skicka alligations med tillhörande user, skapa en funkation osm plockar ut en alligation slumpmässigt och dispalyar den -->
    <header> 
        <h1>
            Game Time!
            <img src="/img/Head_picture.png" class="head_picture">
        </h1>
      </header>

    <div class=text-frame>
        <p>Här ska det komma upp alligations  OBS här får det vara max 325 tecken</p></div>

      <div class="alligator-container">
      <img :style="{ clipPath: 'inset(0 ' + (110 - countPercentageAlligator) + '% 0 0)' }" src="../../public/img/alligatorTimer.png"  alt="countDownAlligator" />
    </div>

    <div class=timerDispaly style="text-align: center;">
        <p v-if="timer > 0"> {{ timer }} </p>
        <p v-else="timer ===0" > {{ goToPodiumView() }} </p> 
    </div>

    <div style="text-align: center; display: flex; justify-content: center;">
    <button v-for="(player, index) in randomizedPlayers" :key="index" v-on:click="checkIfCorrect(player)" id="pollName"> {{ player }} </button> 
    </div>

    {{ poll }}
      xxxx
    {{ players }}
</template>

<script>

import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
name: 'playingGame',
components: {
  ResponsiveNav
},
  data: function() {
    return {
    timer: 15, 
      // players: ['Emelie_LOL_6577',"Mackie_BOI_boom", "Zebra_1337",'Emma', 'Kurt', "Abel", "BOB_saft_lover"], //denna är temoprär för att se om det funkar
    uiLabels: {},
    id: "",
    lang: localStorage.getItem("lang") || "en",
    hideNav: true,
    conf:[],
    poll: {},
    gameCode: 0,
    };
  },

  computed: {
    countPercentageAlligator() {
      return (this.timer / 15) * 100; 
    },

    // randomizedPlayers() {
    // const randomized = this.players.slice().sort(() => Math.random() - 0.5);
    // return randomized.slice(0, 4);
    // },
  },

  created() {
  this.gameCode = this.$route.params.gameCode;
  this.name = this.$route.params.name;
  this.isHost = this.$route.params.isHost === 'true';
  socket.emit("pageLoaded", this.lang);
  socket.emit('randomAllegation', {gameCode: this.gameCode});
  socket.on('getRandomAllegation', (poll) => {
  this.poll = poll
  console.log(poll)
  });
  this.startCountdown();
  //should return when a random allegation has been picked 
  
  
  socket.on("init", (labels) => {
    this.uiLabels = labels
  })
  },

  methods: {
    startCountdown() {
      var countdownInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(countdownInterval);
          this.goToPodiumView();
        }
      }, 1000);
    },

    goToPodiumView() {
      // this.$router.push('/Podium'); // Change '/another-view' to your desired route
      },

    checkIfCorrect(player) {
        console.log(`Clicked on ${player}`); 
        //här ska vi kolla om det namnet man klickar på är rätt svar
    }
  },
  
};
</script>

<style>

.text-frame {
    border: 4px solid green;
    padding: 2vw; 
    width: 80vw; 
    height: 25vh; 
    resize: none;
    overflow-wrap: break-word;
    margin: 0 auto;
    margin-top: 4vh; 
    font-family: 'Comic Sans MS';
    font-size: 1.5vw; 
}


.alligator-container {
  overflow: hidden;
  text-align: center;
  margin-top: 10px;
}

img {
  height: auto;
  max-width: 15vw;
  transition: clip-path 1s ease;
  margin: 0 auto;
}

#pollName{
  display: flex;
  justify-content: center;
  align-items: center;
  width:min-content;
  height: 50px; 
  border-radius: 40px; 
  border: 3px solid blue;
  padding: 10px;
  margin:40px auto;
  color: blue;
  text-align: center;
  background-color: #81b8ce;
 
}


@media screen and (max-width:50em) {
    
.text-frame {
    font-size: 2.8vw; 
    height: 30vh; 
}

img {
  max-width: 35vw;
}

}

</style>