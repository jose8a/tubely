<template>
  <div class="play-controls">
    <button
      type="set"
      @click="toggleShowControls"
      id="settings"
      class="btn-playlist">
      Settings
    </button>
    <size-select></size-select>
    <xchart-select></xchart-select>
    <glist-select></glist-select>
  </div> <!-- END:play-controls -->
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'PlayerControls',
  data: function() {
    return {
      controlStatus: 'open',
      playerDomNode: null,
    };
  },
  created: async function() {
    document.addEventListener('ytube-ready', this.handleYTReady);
  },
  methods: {
    handleYTReady: function() {
      this.playerRef = window.ytplayer;
      this.playerDomNode = document.getElementById("player");
    },
    toggleShowControls: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      if (this.controlStatus === 'closed') {
        this.showControls(evt);
      } else {
        this.hideControls(evt);
      }
    },
    showControls: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.playerDomNode.classList.add("player-slide-out");
      this.playerDomNode.classList.remove("player-slide-in");
      this.controlStatus = 'open';
      console.log('player-controls-show');
    },
    hideControls: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.playerDomNode.classList.add("player-slide-in");
      this.playerDomNode.classList.remove("player-slide-out");
      this.controlStatus = 'closed';
      console.log('player-controls-hide');
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

