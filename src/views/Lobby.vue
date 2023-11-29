<template>
    <body>
<p> Lobby: displaying game code and entered players </p>


<div>
  <div v-for="(d, key) in dengrejen" 
       v-bind:style="{ left: order.details.x + 'px', 
                       top: order.details.y + 'px'}" 
       v-bind:key="'dots' + key">
    {{ key }}
  </div>
</div>


</body>
</template>

<script>
export default {
  name: 'Lobby',
  data: function () {
    return {
      dengrejen: null
    }
  },
  created: function () {
//   this.id = this.$route.params.id;
//   socket.emit("pageLoaded", this.lang);
//   socket.on("init", (labels) => {
//     this.uiLabels = labels
//   })
//   socket.on("dataUpdate", (data) =>
//     this.data = data
//   )
//   socket.on("pollCreated", (data) =>
//     this.data = data)
//----------------------------------------------------------------
//    socket.on("gameCreated", (data) =>
//      this.data = data)
//     console.log('hejhej')

  //----------------------------------------------------------------
},
  methods: {
    clearQueue: function () {
      socket.emit('clearQueue');
    }
  }
}
</script>

<style>
</style>