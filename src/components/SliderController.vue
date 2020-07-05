<template>
  <!-- Add the player-slide controls into the selector slot -->
  <button
    @click="toggleShowControls"
    data-type="set"
    class="list-type">
      &#9881;
  </button>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'SliderController',
  props: [],
  data: function() {
    return {
      playerWrapperDomNode: null,
      playerSLideStatus: 'open',
      playerSlideStatus: null,
    };
  },
  created: async function() {
    document.addEventListener('ytube-ready', this.handleYTReady);
  },
  methods: {
    handleYTReady: function() {
      this.playerWrapperDomNode = document.getElementById("player-wrapper");

      // ==================================================
      // slide-in player on reload -- player usually starts out in
      //  the slide-out position
      // --- this.playerWrapperDomNode.classList.add("player-slide-in");
      this.playerWrapperDomNode.classList.remove("player-slide-out");
      this.playerSlideStatus = "closed";

      console.log(`Player should be visible!`);
    },
    toggleShowControls: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      if (this.playerSlideStatus === 'closed') {
        this.showControls(evt);
      } else {
        this.hideControls(evt);
      }

      console.log(`Player slide-in-out toggled.`);
    },
    showControls: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.playerWrapperDomNode.classList.add("player-slide-out");
      this.playerWrapperDomNode.classList.remove("player-slide-in");
      this.playerSlideStatus = 'open';
      console.log('player-controls-show');
    },
    hideControls: function(evt) {
      evt.preventDefault();
      evt.stopPropagation();

      this.playerWrapperDomNode.classList.add("player-slide-in");
      this.playerWrapperDomNode.classList.remove("player-slide-out");
      this.playerSlideStatus = 'closed';
      console.log('player-controls-hide');
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .list-type {
    /* flex-grow: 1; */
    width: 25%;
    padding: .25rem;
    margin-bottom: 0.25rem;
    padding-top: .75rem;
    padding-bottom: .75rem;
    margin: 0;
  }

  .list-type {
    font-size: 1.25rem;
    font-size: 0.75rem;
    color: var(--primary-color-light);
    border: 1px solid var(--primary-color-light);
    background-color: var(--primary-color-darker);
    background-color: var(--primary-alt-color-darker);
  }

  .list-type:hover {
    cursor: pointer;
    color: var(--accent-color-lite);
    transform: scale(1.03);
    background-color: var(--grey-color-dark);
  }

  button[data-type="set"] {
    color: var(--accent-color-lite);
    background-color: rgba(255, 182, 16, 0.1);
  }

</style>

