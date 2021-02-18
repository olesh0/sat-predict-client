<template>
  <div class="wrapper">
    <app-selected-sattelite class="selected-sattelite" />

    <app-predicted-passes class="predicted-passes" />

    <div class="map">
      <div
        class="sections-list"
        :class="{
          show: showSelectSection,
        }"
      >
        <h1>Sattelite sections</h1>

        <div class="list">
          <div
            v-for="(section) in categories"
            v-bind:key="section"
            class="item"
            @click="loadSection(section)"
          >{{section}}</div>
        </div>
      </div>

      <div class="map-wrapper">
        <div class="sections">
          <div
            v-for="(section) in sections"
            v-bind:key="section"
            @click="selectedSection = section"
            class="section"
            :class="{ selected: selectedSection === section }"
          >{{section}}</div>
        </div>

        <app-map v-if="selectedSection === 'Map'" class="app-map" />
        <app-compass v-if="selectedSection === 'Compass'" class="app-map" />
        <app-sun-and-moon v-if="selectedSection === 'Sun & Moon'" class="app-map" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import store from '@/store'

import AppSelectedSattelite from '@/components/templates/dashboard/AppSelectedSattelite.vue'
import AppPredictedPasses from '@/components/templates/dashboard/AppPredictedPasses.vue'
import AppMap from '@/components/templates/dashboard/AppMap.vue'
import AppCompass from '@/components/templates/dashboard/AppCompass.vue'
import AppSunAndMoon from '@/components/templates/dashboard/AppSunAndMoon.vue'

export default {
  data() {
    return {
      sections: ['Map', 'Compass', 'Sun & Moon'],
      selectedSection: 'Map',
    }
  },
  computed: {
    ...mapGetters({
      showSelectSection: 'ui/showSelectSection',
      categories: 'sattelites/categories',
    }),
  },
  methods: {
    ...mapActions({
      getCategories: 'sattelites/getCategories',
      predictPassesForSection: 'sattelites/getPredictedPasses',
    }),
    async loadSection(sectionName) {
      store.commit('sattelites/setCategory', sectionName, { root: true })
      store.commit('ui/setShowSelectSection', false)

      await this.predictPassesForSection(sectionName)
    },
  },
  async created() {
    const categories = await this.getCategories()

    store.commit('sattelites/setCategory', categories[0], { root: true })

    await this.predictPassesForSection(categories[0])
  },
  components: {
    AppSelectedSattelite,
    AppPredictedPasses,
    AppCompass,
    AppSunAndMoon,
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
    position: relative;

    height: 100%;

    .app-map, .map-wrapper {
      width: 100%;
      height: 100%;
    }

    .sections {
      position: absolute;
      top: 0;
      left: 0;

      padding: 10px;
      background: #242729;
      justify-content: flex-start;

      display: grid;
      grid-template-columns: repeat(3, auto);
      grid-gap: 20px;

      margin-bottom: 5px;
      width: 100%;

      .section {
        padding: 5px 7px;
        color: #5F6D77;
        cursor: pointer;

        &.selected {
          color: #22D5A4;
        }
      }
    }

    .sections-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 200;

      width: 100%;
      height: 100%;
      background: #242729;
      padding: 2rem;

      opacity: 0;
      visibility: hidden;

      transform: scale(.8);
      transition: all .2s;

      &.show {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
      }

      h1 {
        margin: 0 0 5px;
        font-weight: 100;
        font-size: 2.2rem;
      }

      .list {
        margin-top: 20px;
        max-height: 77vh;
        overflow: auto;

        .item {
          cursor: pointer;
          margin-bottom: 10px;
          color: #5F6D77;

          &:hover {
            color: #eee;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
