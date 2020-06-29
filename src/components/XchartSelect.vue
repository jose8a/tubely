<template>
  <div id="chartSelects">
    <button
      v-for="(opt, index) in chartOpts"
      type="submit"
      @click="chartSet"
      :id="opt.id"
      class="btn-playlist"
      :key="'btn-opt-' + index">{{ opt.label }}
    </button>
  </div> <!-- END:chartSelects -->
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'XchartSelect',
  data: function() {
    return {
      playerDomNode: null,
      chartOpts: [
        {id: 'hot100', label: 'Sizzle'},
        {id: 'latin', label: 'Latin'},
        {id: 'edm', label: 'EDM'},
        {id: 'rnb', label: 'Hip Hop'},
        {id: 'alt', label: 'Alt'},
        {id: 'rock', label: 'Rock'},
        {id: 'rap', label: 'Rap'},
      ],
    };
  },
  created: async function() {
    document.addEventListener('ytube-ready', this.handleYTReady);
  },
  methods: {
    handleYTReady: function() {
      this.playerDomNode = document.getElementById("player");
    },
    chartSet: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      const id = evt.target.id;
      const inType = evt.target.type;
      console.log(`tag: ${inType} -- id: ${id}`);

      // ensures that the player slides in if open, else
      //  it remains in the 'slide-in' end state
      this.hideControls(evt);

      // FORCE-LOAD NEW PLAYLIST
      const newList = {
        chart: evt.target.id,
        size: this.playlistSize
      };

      this.$emit("chartSet", newList);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

