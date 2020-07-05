<template>
  <div id="gl-playlists">
    <button
      v-for="(gl, index) in gLists"
      @click="setNewActivePlaylist"
      type="submit"
      :id="gl.id"
      :class="'btn-glist ' + gl.type"
      :data-visible="gl.isActive"
      :data-action="gl.action"
      :key="'btn-gl-' + index">{{ gl.name }}
    </button>
  </div>
</template>

<script>
/* eslint-disable no-console */
import axios from 'axios';

export default {
  name: 'PlaylistSelector',
  data: function() {
    return {
      // --- baseUrl: `http://localhost:3550`,
      baseUrl: `https://tubester.azurewebsites.net`,
      playlistSize: null,
      chartOpts: [
        {id: 'hot100', name: 'Sizzle'},
        {id: 'latin', name: 'Latin'},
        {id: 'edm', name: 'EDM'},
        {id: 'rnb', name: 'Hip Hop'},
        {id: 'alt', name: 'Alt'},
        {id: 'rock', name: 'Rock'},
        {id: 'rap', name: 'Rap'},
      ],
      gLists: null,
    };
  },
  created: async function() {
    // --- document.addEventListener('ytube-ready', this.handleYTReady);
    console.log(`DEBUG::PlaylistSelectorBaseUrl: ${this.baseUrl}`);

    // get the YT filenamess available - each file contains and represents
    //    a single user-playlist on YT
    let response = await axios.get(`${this.baseUrl}/playlist/google-lists`);
    this.gLists = response.data.lists;

    // build a collection of playlists, each representing a single file that
    //    contains a collection of video/song metadata that as a whole represents
    //    an actual playlists on youtube
    this.buildPlaylistCollection();

    // notifly listeners that list of Playlist IDs/filenames was loaded
    this.notifyPlaylistsLoaded(this.gLists);
  },
  methods: {
    cleanListName: function(listName) {
      let nameArray = listName.split('-');

      // remove the leading 'tunz' or 'edm' segment
      nameArray.shift();

      // remove the trailing 'vids' segment
      nameArray.pop();

      return nameArray.join('-');
    },
    addChartsToPlaylistCollection: function(playlistCollection) {
      this.chartOpts.forEach( list => {
        const newItem = {};

        newItem.id = list.id;
        newItem.name = list.name;
        newItem.action = "chartSet";

        newItem.type = "chart";
        newItem.isActive = "show";
        playlistCollection.push(newItem);
      });
    },
    buildPlaylistCollection: function() {
      const newGList = [];

      const isEdm = /edm/i;
      const isRok = /rock/i;
      const isUrban = /hip|hop|pop|dance|soul|beats|aces/i;
      const isLatin = /paso|pasito|span|salsa|trio|trad|norte|espa/i;
      const isMix = /mix|dj|concert/i;

      this.addChartsToPlaylistCollection(newGList);

      this.gLists.forEach( list => {
        const newItem = {};

        newItem.id = list;
        newItem.name = this.cleanListName(list);
        newItem.action = "gListSet";

        if (isMix.test(list)) {
          newItem.type = "mix";
          newItem.isActive = "";
          newGList.push(newItem);
          return true;
        }

        if (isEdm.test(list)) {
          newItem.type = "edm";
          newItem.isActive = "";
          newGList.push(newItem);
          return true;
        }

        if (isRok.test(list)) {
          newItem.type = "rock";
          newItem.isActive = "";
          newGList.push(newItem);
          return true;
        }

        if (isUrban.test(list)) {
          newItem.type = "urban";
          newItem.isActive = "";
          newGList.push(newItem);
          return true;
        }

        if (isLatin.test(list)) {
          newItem.type = "latin";
          newItem.isActive = "";
          newGList.push(newItem);
          return true;
        }

        newItem.type = "misc";
        newItem.isActive = "";
        newGList.push(newItem);
        return true;
      });

      this.gLists = newGList;
    },
    setNewActivePlaylist: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      console.log(`ACTION: ${evt.target.dataset.action}`);

      // Clear all of the selectable playlists from the
      //  currently-active category as not 'active'
      const songListElems = document.querySelectorAll('.btn-glist');
      songListElems.forEach( list => {
        list.setAttribute("data-playlist-status", "");
      });

      // Mark the selected/clicked playlist as active
      const domEl = evt.target;
      domEl.setAttribute("data-playlist-status", "active");

      // wrap the new-and-active playlist-id to notify listeners
      const songList = {
        // --- chart: listId,
        // --- playlistId: listId,
        playlistId: evt.target.id,
        playlistType: evt.target.dataset.action,
        size: this.playlistSize
      };

      this.notifyNewActivePlaylist(songList);
    },
    notifyPlaylistsLoaded: function(payload) {
      // Notify listeners that loading of playlist-ids/filenames completed
      const glistLoaded = new CustomEvent('glist-loaded-ready', {
        bubbles: true,
        detail: { data: payload, text: () => `GL Playlists have been fetched.` }
      });

      // notify other listeners that the playlist-collection data has loaded
      document.dispatchEvent(glistLoaded);
    },
    notifyNewActivePlaylist: function(playlist) {
      // Notify listeners that a new playlist has been selected
      const setNewPlaylist = new CustomEvent('new-playlist', {
        bubbles: true,
        detail: { data: playlist, text: () => `New Playlist has been selected.` }
      });


      console.log(`DEBUG::NewActivePL: ${playlist.playlistId}`);

      // notify other listeners that the playlist-collection data has loaded
      document.dispatchEvent(setNewPlaylist);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btn-glist {
    font-size: 1.25rem;
    font-size: 0.75rem;
    color: var(--primary-color-light);
    border: 1px solid var(--primary-color-light);
    background-color: var(--primary-color-darker);
  }

  .btn-glist:hover {
    cursor: pointer;
    color: var(--accent-color-lite);
    transform: scale(1.03);
    background-color: var(--grey-color-dark);
  }

  button[data-playlist-status="active"] {
    background-color: rgba(255, 182, 16, 0.5);
  }

  .btn-glist::before {
    background-color: var(--accent-color-dark);
  }

  .btn-glist {
    width: 25%;
    flex-grow: 1;
    padding-top: .75rem;
    padding-bottom: .75rem;
    padding: .75rem .5rem;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    display: none;
  }

  .btn-glist::before {
    content: "";
    height: 100%;
    width: 100%;
  }

  [data-visible="show"] {
    display: inline-block;
  }

</style>

