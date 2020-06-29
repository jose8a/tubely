<template>
  <form id="controls">
    <div id="list-size-options">
      <legend id="numSongs-title"># Songs:</legend>
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
      <input id="in-custom" type="text" name="numtunes-input" value="0" v-model="inputPlaylistSize">
    </div>

    <div id="chartSelects">
      <div id="gfilter" @click="filterLists">
        <button class="list-type" data-type="edm">edm</button>
        <button class="list-type" data-type="rock">rock</button>
        <button class="list-type" data-type="urban">urban</button>
        <button class="list-type" data-type="latin">latin</button>
        <button class="list-type" data-type="misc">misc</button>
        <button class="list-type" data-type="mix">mix</button>
        <button class="list-type" data-type="chart">chart</button>

        <button
          @click="toggleShowControls"
          data-type="set"
          data-control-status="controlStatus"
          class="list-type"
        >&#9881;
        </button>
      </div>

      <button
        v-for="(gl, index) in gLists"
        type="submit"
        @click="gListSet"
        :id="gl.id"
        :class="'btn-glist ' + gl.type"
        :data-visible="gl.isActive"
        :data-action="gl.action"
        :key="'btn-gl-' + index">{{ gl.name }}
      </button>
    </div> <!-- END:chartSelects -->

    <div id="gPlaylists">
    </div>
  </form> <!-- END:form::controls -->
</template>

<script>
/* eslint-disable no-console */
import axios from 'axios';

export default {
  name: 'PlayerControls',
  props: {
  },
  data: function() {
    return {
      baseUrl: `http://localhost:3550`,
      controlStatus: 'closed',
      playerDomNode: null,
      inputPlaylistSize: 0,
      radioPlaylistSize: 25,
      radioOpts: [
        10,
        25,
        50
      ],
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
    document.addEventListener('ytube-ready', this.handleYTReady);

    // get the user google-playlists available
    let response = await axios.get(`${this.baseUrl}/playlist/google-lists`);
    this.gLists = response.data.lists;
    this.categorizeGLists();
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
    filterLists: function(evt) {
      evt.preventDefault();

      const domEl = evt.target;
      const listsContainer = evt.currentTarget;
      const songType = domEl.getAttribute("data-type");

      // clear the active status from the current active gList, if any
      for (let i=0; i<listsContainer.children.length; i++) {
        let childNode = listsContainer.children[i];
        childNode.setAttribute("data-list-status", "");
      }

      domEl.setAttribute("data-list-status", "active");
      this.updateListVisibility(songType);
    },
    updateListVisibility: function(songType) {
      const songLists = [...this.gLists];

      // clear current visible lists
      songLists.forEach( list => {
        list.isActive = "";
      });

      // add visibility to selected list-type
      songLists.forEach( list => {
        if (list.type === songType) {
          list.isActive = "show";
        }
      });

      this.gLists = songLists;
    },
    cleanListName: function(listName) {
      let nameArray = listName.split('-');

      // remove the leading 'tunz' or 'edm' segment
      nameArray.shift();

      // remove the trailing 'vids' segment
      nameArray.pop();

      return nameArray.join('-');
    },
    categorizeGLists: function() {
      const newGList = [];

      const isEdm = /edm/i;
      const isRok = /rock/i;
      const isUrban = /hip|hop|pop|dance|soul|beats|aces/i;
      const isLatin = /paso|pasito|span|salsa|trio|trad|norte|espa/i;
      const isMix = /mix|dj|concert/i;

      this.chartOpts.forEach( list => {
        const newItem = {};

        newItem.id = list.id;
        newItem.name = list.name;
        newItem.action = "chartSet";

        newItem.type = "chart";
        newItem.isActive = "show";
        newGList.push(newItem);
      });

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
    handleYTReady: function() {
      this.playerRef = window.ytplayer;
      this.playerDomNode = document.getElementById("player");
    },
    gListSet: async function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      console.log(`ACTION: ${evt.target.dataset.action}`);

      const songListElems = document.querySelectorAll('.btn-glist');
      songListElems.forEach( list => {
        list.setAttribute("data-playlist-status", "");
      });

      const domEl = evt.target;
      domEl.setAttribute("data-playlist-status", "active");

      // FORCE-LOAD NEW PLAYLIST
      // TODO: send event to parent App.vue to load new playlist
      const listId = evt.target.id;

      const songList = {
        chart: listId,
        size: this.playlistSize
      };

      const playAction = evt.target.dataset.action;

      // ensures that the player slides in if open, else
      //  it remains in the 'slide-in' end state
      // --- this.hideControls(evt);
      this.$emit(playAction, songList);
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
  /*
  #gPlaylists {
    position: fixed;
    top: 20vh;
    right: 2vw;
    width: 10%;
  }

  #gPlaylists > #gfilter {
    position: fixed;
    top: 7vh;
    right: 2vw;
    width: 10%;
    height: 10vh;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  */

  #chartSelects > #gfilter {
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .list-type {
    /* flex-grow: 1; */
    width: 25%;
    padding: .25rem;
    margin-bottom: 0.25rem;
    margin: 0;
  }

  .list-type,
  .btn-glist {
    font-size: 1.25rem;
    font-size: 0.75rem;
    color: var(--primary-color-light);
    border: 1px solid var(--primary-color-light);
    background-color: var(--primary-color-darker);
  }

  .list-type:hover,
  .btn-glist:hover {
    cursor: pointer;
    color: var(--accent-color-lite);
    transform: scale(1.03);
    background-color: var(--grey-color-dark);
  }

  button[data-type="set"] {
    color: var(--accent-color-lite);
    background-color: rgba(255, 182, 16, 0.1);
  }

  button[data-playlist-status="active"],
  button[data-list-status="active"] {
    background-color: rgba(255, 182, 16, 0.5);
  }

  /*list-size-options::before,
  p::before,*/
  .btn-glist::before {
    background-color: var(--accent-color-dark);
  }

  .btn-glist {
    /* height: 4.5rem; */
    width: 25%;
    flex-grow: 1;
    padding-top: .75rem;
    padding-bottom: .75rem;
    padding: .75rem .5rem;
  }

  .btn-glist::before {
    content: "";
    height: 100%;
    width: 100%;
  }

  .btn-glist {
    text-overflow: ellipsis;

    overflow: hidden;
    white-space: nowrap;
  }

  .btn-glist {
    display: none;
  }

  [data-visible="show"] {
    display: inline-block;
  }

</style>

