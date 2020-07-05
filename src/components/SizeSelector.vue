<template>
  <div id="list-size-options">
    <legend id="numSongs-title"># Songs:</legend>
    <template v-for="rval in radioOpts">
      <label
        :id="'lab' + rval"
        for="'num' + rval"
        :key="'rl' + rval">
          {{ rval }}
      </label>
      <input
        :id="'rad' + rval"
        type="radio"
        name="numtunes-radio"
        v-model="playlistSize"
        :value="rval"
        :key="'ri' + rval">
    </template>
    <input
      id="in-custom"
      type="text"
      name="numtunes-input"
      value="0"
      v-model="playlistSize">
  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'SizeSelector',
  data: function() {
    return {
      playlistSize: null,
      inputPlaylistSize: 0,
      radioPlaylistSize: 10,
      radioOpts: [
        10,
        25,
        50
      ],
    };
  },
  mounted: function() {
    this.$emit('update-size', this.radioPlaylistSize);
    this.playlistSize = this.radioPlaylistSize;
  },
  watch: {
    playlistSize: function(oldSize, newSize) {
      // TODO:FIXME:
      //    possibly need to handle the case where the 'input' value
      //    is zero or less (negative)
      this.$emit('update-size', this.playlistSize);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

