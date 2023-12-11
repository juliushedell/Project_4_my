<template>

    <header> 
        <h1>
            Game Time!
            <img src="/img/Head_picture.png" class="head_picture">
        </h1>
      </header>

      <div class="alligator-container">
      <img :style="{ clipPath: 'inset(0 ' + (110 - countPercentageAlligator) + '% 0 0)' }" src="img\alligatorTimer.png" alt="countDownAlligator" />
      <!-- här måste vi lägga in en ny bild på en alligator med lite mer utrymme till höger -->
    </div>

    <div>
        <p v-if="timer > 0">Time left: {{ timer }}</p>
        <p v-else> "Slut på timer" </p>
    </div>

</template>

<script>
export default {
  data: function() {
    return {
      timer: 15,
    };
  },

  computed: {
    countPercentageAlligator() {
      // Calculate the percentage based on the current countdown value
      return (this.timer / 15) * 100; // Assuming a countdown from 10 seconds
    },
  },

  created() {
    this.startCountdown();
  },

  methods: {
    startCountdown() {
      var countdownInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);
    },
  },
};
</script>

<style>

.alligator-container {
  overflow: hidden;

}

img {
  height: auto;
  max-width: 25vw;
  transition: clip-path 1s ease; /* Add a smooth transition effect for clip-path changes */
}

</style>