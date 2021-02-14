<template>
  <div class="wrapper">
    <app-selected-sattelite class="selected-sattelite" />

    <app-predicted-passes class="predicted-passes" />

    <app-map class="map" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import store from '@/store'

import AppSelectedSattelite from '@/components/templates/dashboard/AppSelectedSattelite.vue'
import AppPredictedPasses from '@/components/templates/dashboard/AppPredictedPasses.vue'
import AppMap from '@/components/templates/dashboard/AppMap.vue'

export default {
  methods: {
    ...mapActions({
      getCategories: 'sattelites/getCategories',
      predictPassesForSection: 'sattelites/getPredictedPasses',
    }),
  },
  async created() {
    const categories = await this.getCategories()

    store.commit('sattelites/setCategory', categories[0], { root: true })

    await this.predictPassesForSection(categories[0])
  },
  components: {
    AppSelectedSattelite,
    AppPredictedPasses,
    AppMap,
  },
}
</script>

<style lang="less" scoped>
.wrapper {
  height: 90vh;
  width: 95vw;

  display: grid;
  grid-template-areas: "selectedSat map" "predictedPasses map";
  grid-template-columns: 4fr 3fr;
  grid-template-rows: 1fr 2fr;
  grid-gap: 15px;

  .selected-sattelite,
  .predicted-passes {
    background: #242729;
    padding: 2rem;
  }

  .selected-sattelite {
    grid-area: selectedSat;
  }

  .predicted-passes {
    grid-area: predictedPasses;
  }

  .map {
    grid-area: map;
    background: #000;
  }
}
</style>
