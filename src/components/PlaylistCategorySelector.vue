<template>
  <div
    id="gfilter"
    @click="updateActiveCategory"
  >
    <template v-for="category in categories">
      <button
        class="list-type"
        :data-type="category"
        :key="category"
      >
        {{ category }}
      </button>
    </template>

    <!--
      put in a slot for additional content from the parent ..
      e.g a slider control
    -->
    <slot></slot>

  </div>
</template>

<script>
/* eslint-disable no-console */
export default {
  name: 'PlaylistCategorySelector',
  data: function() {
    return {
      categories: [
        'edm',
        'rock',
        'urban',
        'latin',
        'misc',
        'mix',
        'chart'
      ]
    };
  },
  created: function() {
    document.addEventListener('glist-loaded-ready', this.initializeCategory);
  },
  mounted: function() {
    // create hook for default-selected list to be styled differently
    const defaultSelection = document.querySelector("[data-type='chart']");
    defaultSelection.setAttribute("data-list-status", "active");
  },
  methods: {
    initializeCategory: function() {
      // make 'chart' the default category option
      this.$emit('update-category', { activeCategory: 'chart', allCategories: [...this.categories]});
    },
    updateActiveCategory: function(evt) {
      evt.preventDefault();
      console.log(`click: update-category - child event.`);

      const domEl = evt.target;
      const listsContainer = evt.currentTarget;
      const songType = domEl.getAttribute("data-type");

      // clear the active status from the current active gList, if any
      for (let i=0; i<listsContainer.children.length; i++) {
        let childNode = listsContainer.children[i];
        childNode.setAttribute("data-list-status", "");
      }

      // create hook for currently-selected list to be styled differently
      domEl.setAttribute("data-list-status", "active");

      // notify the parent of the updated category selection
      // --- this.updateListVisibility(songType);
      this.$emit('update-category', { activeCategory: songType, allCategories: [...this.categories]});
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
  }

  .list-type {
    background-color: var(--primary-alt-color-darker);
  }

  .list-type:hover {
    cursor: pointer;
    color: var(--accent-color-lite);
    transform: scale(1.03);
    background-color: var(--grey-color-dark);
  }

  button[data-list-status="active"] {
    background-color: rgba(255, 182, 16, 0.5);
  }

</style>

