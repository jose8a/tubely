<template>
  <div id="app">
    <div id="player-status">
      <span id="num-temp" class="status-playing">
        <span class="material-icons">
          playlist_play
        </span>
        {{ activePlaylistIndex }}/{{ playlistLength }}
      </span>
      <span id="active-list" class="status-playing">
        <span class="material-icons">
          play_arrow
        </span>
        {{ chart }}
      </span>
    </div>

    <div id="player-wrapper" class="player-slide-out">
      <div id="player" class=""></div>
    </div>

    <player-controls
      @chartSet="reloadPlaylist"
      @gListSet="loadGList"
    >
    </player-controls>

    <div id="screen-dims">{{ pageWidth }}W x {{ pageHeight }}H</div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import PlayerControls from './components/PlayerControls.vue'
import axios from 'axios';

export default {
  name: 'app',
  components: {
    PlayerControls
  },
  data: function() {
    return {
      baseUrl: `http://localhost:3550`,
      activePlaylistIndex: 1,
      activePlaylistLength: null,
      playerRef: null,
      allSongs: null,
      chart: 'hot100',
      sizePlaylist: 25,
      activeGList: null,
      gListSongs: null,
      pageWidth: null,
      pageHeight: null
    };
  },
  watch: {
  },
  created: function() {
    // listen to ytube-* events here
    document.addEventListener('ytube-ready', this.handleYTReady);
    document.addEventListener('ytube-state-changed', this.handleYTChanged);
    document.addEventListener('ytube-error', this.handleYTError);

    this.pageWidth = window.innerWidth
    this.pageHeight = window.innerHeight
  },
  mounted: function() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    });

    /*
      //  create and emit a custom event here so that Vue app can catch it and react
      //  accordingly:
      //    -- allow bubbling
      //    -- pass along data via the "details" property
      const loadYTApi = new CustomEvent('yt-api-load', {
        bubbles: true,
        detail: { data: `api-load`, text: () => `YT Player API bootstrap.` }
      });

      document.dispatchEvent(loadYTApi);
      console.log(`Create and dispatch 'yt-api-load' event`);
    */
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.onResize);
  },
  computed: {
    playlistLength() {
      if(this.activePlaylistLength) {
        return this.activePlaylistLength;
      }

      return this.sizePlaylist;
    },
  },
  methods: {
    onResize: function() {
      this.pageWidth = window.innerWidth
      this.pageHeight = window.innerHeight
    },
    handleYTReady: function() {
      // 4. The API will call this function when the video player is ready.
      console.log(`YT Ready in Vue!`);

      // ==================================================
      // once the player has been fully loaded, get handles to both
      //  it's DOM node, and also its JS Object to directly control
      //  it via the embedded iFrame player API
      this.playerRef = window.ytplayer;

      // ==================================================
      // Converting touch events to mouse events for DRY handling
      // ----- TODO: VUE-REFACTOR:
      //   \-->  document.addEventListener("touchstart", touch2Mouse, true);

      // ----- this.altLoadNewPlaylist(defaultChart);
      this.altLoadNewPlaylist();
      this.playerRef = window.ytplayer;

      // --- set defaults for the player to start on
      this.playerRef.setVolume(15);
      this.playerRef.setPlaybackQuality('small');
      this.playerRef.playVideo();
    },
    handleYTChanged: function(evt) {
      let stateChangeId = evt.detail.data;

      if (stateChangeId === YT.PlayerState.ENDED) {
        console.log(`YTPlayer ENDED ...`);
      }

      if (stateChangeId === YT.PlayerState.CUED) {
        console.log(`YTPlayer CUED ...`);
      }

      if (stateChangeId === YT.PlayerState.PLAYING) {
        console.log(`YTPlayer PLAYING ...`);
      }
      const activePlaylist = this.playerRef.getPlaylist();
      this.activePlaylistLength = activePlaylist.length;
      this.activePlaylistIndex = this.playerRef.getPlaylistIndex() + 1;
      console.log(`LOCAL-change: ${evt.detail.text}`);
    },
    handleYTError: function(evt) {
      let errString = '';

      if (evt.detail.data === 2) {
        errString = 'INVALID_PARAMETER_VALUE';
      }

      if (evt.detail.data === 5) {
        errString = 'INCOMPATIBLE_HTML5_CONTENT';
      }

      if (evt.detail.data === 100) {
        errString = 'VIDEO_NOT_FOUND';
      }

      if (evt.detail.data === 101) {
        errString = 'VIDEO_NOT_EMBEDDABLE_101';
      }

      if (evt.detail.data === 150) {
        errString = 'VIDEO_NOT_EMBEDDABLE_150';
      }

      console.log(`YTPlayer-error: ${evt.detail.data} - ${errString}`);

      if (this.activePlaylistIndex >= this.activePlaylistLength) {
        this.playerRef.stopVideo();
      } else {
        this.playerRef.nextVideo();
      }
    },
    loadGList: async function(data) {
      // get the user google-playlists available
      const listId = data.chart;
      this.activeGList = listId;
      this.sizePlaylist = data.size;
      // --- this.chart = this.cleanListName(data.chart);
      this.chart = data.chart;

      console.log(`\n\nLIST-ID: ${listId}`);
      let songData = [];
      let response = null;

      try {
        response = await axios.get(`${this.baseUrl}/glist/${listId}`);
        songData = [ ...response.data ];
      } catch(err) {
        console.log(`ERR: ${err}`);
      }

      // ----- DEBUG:
      // ----- for (let item of songData) {
      // -----   console.log(`GSONG-ID: ${item}`);
      // ----- }

      this.gListSongs = [ ...songData ];
      // ----- DEBUG: console.log(`${listId} -- #${songData.length} songs received!\n\n`);

      const playlistSongIds = this.createRandSonglist(songData);

      this.allSongs = [ ...playlistSongIds ];
      this.playerRef.loadPlaylist( playlistSongIds );
    },
    reloadPlaylist: function(data) {
      this.chart = data.chart;
      this.sizePlaylist = data.size;
      this.altLoadNewPlaylist();
    },
    createRandSonglist: function(songlist) {
      let playlistSongIds = [];

      let remixedSongIds = this.shuffleFY(songlist);
      let numSongs = songlist.length;

      // make sure the playlist size is not larger than the number of
      // available songs
      if (this.sizePlaylist > numSongs) {
        this.sizePlaylist = numSongs;
        // TODO: do not allow user to create playlist larger than numSongs
      }

      // create a unique Set of song IDs to create the playlist
      let songSet = new Set();
      while (songSet.size < this.sizePlaylist) {
        // generate random number and insert into Set
        let randIndex = Math.floor(Math.random() * Math.floor(numSongs));
        let songId = remixedSongIds[randIndex];

        if (!songSet.has(songId)) songSet.add(songId);
      }

      for (let songId of songSet.values()) playlistSongIds.push(songId);

      // ----- altLoad ENDS here ----------------------------------------
      // ----- DEBUG:
      // ----- console.log(playlistSongIds);
      // ----- console.log(`LOADED data: ${playlistSongIds.length}`);

      return playlistSongIds;
    },
    // get and load a new set of songs to play
    altLoadNewPlaylist: async function() {
      let response = await axios.get(`${this.baseUrl}/playlist/${this.chart}`);
      let songIds = Object.keys(response.data.songs);

      const playlistSongIds = this.createRandSonglist(songIds);

      this.allSongs = [ ...playlistSongIds ];
      this.playerRef.loadPlaylist( playlistSongIds );
    },
    // this is an ES6 version of the fisher-yates shuffle
    //    algorithm with JS
    shuffleFY: function(array) {
      let len = array.length;

      for (let i = len - 1; i > 0; i -= 1) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }

      return array;
    },
    cleanListName: function(listName) {
      let nameArray = listName.split('-');

      // remove the leading 'tunz' or 'edm' segment
      nameArray.shift();

      // remove the trailing 'vids' segment
      nameArray.pop();

      return nameArray.join('-');
    },
  },
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
    /*
    border: 1px solid hsla(315, 10%, 90%, 0.8);
    border-radius: 1.5rem;
    */
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
