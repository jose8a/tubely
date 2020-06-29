<template>
  <div id="gPlaylists">
    <button
      v-for="(gl, index) in gLists"
      type="submit"
      @click="gListSet"
      :id="gl"
      class="btn-glist"
      :key="'btn-gl-' + index">{{ gl }}
    </button>
  </div>
</template>

<script>
/* eslint-disable no-console */
import axios from 'axios';

export default {
  name: 'GlistSelect',
  data: function() {
    return {
      baseUrl: `http://localhost:3550`,
      playerDomNode: null,
      gLists: null,
    };
  },
  created: async function() {
    document.addEventListener('ytube-ready', this.handleYTReady);

    // get the user google-playlists available
    let response = await axios.get(`${this.baseUrl}/playlist/google-lists`);
    this.gLists = response.data.lists;
  },
  methods: {
    handleYTReady: function() {
      this.playerDomNode = document.getElementById("player");
    },
    gListSet: async function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      // FORCE-LOAD NEW PLAYLIST
      const listId = evt.target.id;
      const songList = {
        chart: listId,
        size: this.playlistSize
      };

      this.$emit("gListSet", songList);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

