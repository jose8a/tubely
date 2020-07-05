<template>
  <form id="controls">

    <size-selector
      id="list-size-options"
      @update-size="updatePlaylistSize">
    </size-selector>

    <div id="chartSelects">
      <playlist-category-selector
        id="gfilter"
        @update-category="updateCategory"
      >
        <slider-controller></slider-controller>
      </playlist-category-selector>

      <playlist-selector></playlist-selector>
    </div> <!-- END:chartSelects -->

    <div id="gPlaylists">
    </div>
  </form> <!-- END:form::controls -->
</template>

<script>
/* eslint-disable no-console */
import SliderController from '@/components/SliderController';
import SizeSelector from '@/components/SizeSelector';
import PlaylistCategorySelector from '@/components/PlaylistCategorySelector';
import PlaylistSelector from '@/components/PlaylistSelector';

export default {
  name: 'PlayerControls',
  components: {
    'size-selector': SizeSelector,
    'playlist-category-selector': PlaylistCategorySelector,
    'playlist-selector': PlaylistSelector,
    'slider-controller': SliderController,
  },
  data: function() {
    return {
      // --- baseUrl: `http://localhost:3550`,
      baseUrl: `https://tubester.azurewebsites.net`,
      playlistSize: null,
      gLists: null,
    };
  },
  created: async function() {
    document.addEventListener('glist-loaded-ready', this.gListsReady);
  },
  methods: {
    updatePlaylistSize: function(size) {
      this.playlistSize = size;
      this.$emit('update-size', this.playlistSize);
    },
    updateCategory: function(categoryEventData) {
      this.updateListVisibility(categoryEventData.activeCategory);
    },
    updateListVisibility: function(songType) {
      console.log(`Event handling: updateListVisibility`);
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
    gListsReady: function(evt) {
      this.gLists = evt.detail.data;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

