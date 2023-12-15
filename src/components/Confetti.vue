<template>
  <div>
    <canvas ref="confettiCanvas"></canvas>
  </div>
</template>

<script>
export default {
  mounted() {
    this.createConfetti(); // Adjusted method name
  },
  methods: {
    random(min, max) {
      return Math.random() * (max - min) + min;
    },
    createConfetti() {
      const canvas = this.$refs.confettiCanvas;
      const ctx = canvas.getContext('2d');

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const confetti = [];

      for (let i = 0; i < 100; i++) {
        const confetto = {
          x: this.random(0, canvas.width),
          y: this.random(0, canvas.height),
          size: this.random(10, 20),
          color: this.randomColor(),
          speedX: this.random(-5, 5),
          speedY: this.random(5, 10),
          rotation: this.random(0, 2 * Math.PI),
        };

        confetti.push(confetto);
      }

      const drawConfetto = (confetto) => {
        ctx.beginPath();
        ctx.arc(confetto.x, confetto.y, confetto.size, 0, 2 * Math.PI);
        ctx.fillStyle = confetto.color;
        ctx.fill();
        ctx.closePath();
      };

      const updateConfetti = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const confetto of confetti) {
          confetto.y += confetto.speedY;
          confetto.x += confetto.speedX;

          confetto.rotation += 0.1;

          drawConfetto(confetto);
        }

        requestAnimationFrame(updateConfetti);
      };

      updateConfetti();
    },
    randomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
</script>

<style scoped>
canvas {
  display: block;
}
</style>