<template>
  <div id="player-status">
    <span id="num-temp" class="status-playing">
      <span class="material-icons">
        playlist_play
      </span>
      {{ activeSongIndex }}/{{ playlistSize }}
    </span>
    <span id="active-list" class="status-playing">
      <span class="material-icons">
        play_arrow
      </span>
      {{ playlistName }}
    </span>
  </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'PlaylistStatus',
  props: [
    'playlistName',
    'playlistSize',
    'activeSongIndex'
  ],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #player-status {
    z-index: 100;
    padding: 0.25rem 0.5rem;
    margin-bottom: 0.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-playing {
    color: hsla(15, 10%, 90%, 0.95);
    color: var(--accent-color-med);
    background-color: var(--primary-color-darker);
    font-size: 1.5rem;
    padding: 0.35rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #player-status span span {
    padding-top: 0.1rem;
  }

</style>
