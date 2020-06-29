<template>
  <div id="list-size-options">
    <legend id="numSongs-title"># Songs:</legend>
    <!-- div v-for="rval in radioOpts" :key="'opt-' + rval" class="size-option" -->
    <template v-for="rval in radioOpts">
      <label :id="'lab' + rval"
              for="'num' + rval"
              :key="'rl' + rval">{{ rval }}</label>
      <input :id="'rad' + rval"
              type="radio" name="numtunes-radio"
              v-model.number="radioPlaylistSize"
              :value="rval"
              :key="'ri' + rval">
    </template>
    <!-- /div -->
    <input id="in-custom"
            type="text"
            name="numtunes-input"
            value="0"
            v-model="inputPlaylistSize">
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'SizeSelect',
  data: function() {
    return {
      playerDomNode: null,
      inputPlaylistSize: 0,
      radioPlaylistSize: 10,
      radioOpts: [
        10,
        25,
        50
      ],
    };
  },
  created: async function() {
    document.addEventListener('ytube-ready', this.handleYTReady);
  },
  computed: {
    playlistSize: function() {
      // set the playlistSize - depends if the input is set > 0
      if (parseInt(this.inputPlaylistSize, 10) > 0) {
        return this.inputPlaylistSize;
      } else {
        return this.radioPlaylistSize;
      }
    }
  },
  methods: {
    handleYTReady: function() {
      this.playerDomNode = document.getElementById("player");
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

