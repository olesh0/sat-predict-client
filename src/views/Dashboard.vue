<template>
  <div class="wrapper">
    <app-selected-sattelite class="selected-sattelite" />

    <app-predicted-passes class="predicted-passes" />

    <div class="map">map</div>
  </div>
</template>

<script>
import AppSelectedSattelite from '@/components/templates/dashboard/AppSelectedSattelite.vue'
import AppPredictedPasses from '@/components/templates/dashboard/AppPredictedPasses.vue'

export default {
  components: {
    AppSelectedSattelite,
    AppPredictedPasses,
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
