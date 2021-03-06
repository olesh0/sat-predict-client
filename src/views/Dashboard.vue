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
            class="item"
            @click="loadSection($data.__FAVORITES__)"
          >
            {{$data.__FAVORITES__}}
          </div>

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
          <div class="list">
            <div
              v-for="(section) in sections"
              v-bind:key="section"
              @click="selectedSection = section"
              class="section"
              :class="{ selected: selectedSection === section }"
            >{{section}}</div>
          </div>

          <Settings class="settings-icon" />
        </div>

        <app-map v-if="selectedSection === 'Map'" class="app-map" />
        <app-compass v-if="selectedSection === 'Compass'" class="app-map" />
        <app-sun-and-moon v-if="selectedSection === 'Sun & Moon'" class="app-map" />
        <app-user-coords v-if="selectedSection === 'Coords'" class="app-map" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import store from '@/store'

import Settings from '@/assets/icons/Settings'
import AppSelectedSattelite from '@/components/templates/dashboard/AppSelectedSattelite.vue'
import AppPredictedPasses from '@/components/templates/dashboard/AppPredictedPasses.vue'
import AppMap from '@/components/templates/dashboard/AppMap.vue'
import AppCompass from '@/components/templates/dashboard/AppCompass.vue'
import AppSunAndMoon from '@/components/templates/dashboard/AppSunAndMoon.vue'
import AppUserCoords from '@/components/templates/dashboard/AppUserCoords.vue'

export default {
  data() {
    return {
      sections: ['Map', 'Compass', 'Sun & Moon', 'Coords'],
      selectedSection: 'Map',
      __FAVORITES__: 'Favorites',
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
      getUserLocation: 'coords/getUserCoords',
    }),
    async loadSection(sectionName) {
      store.commit('ui/setShowPreloader', true)

      store.commit('sattelites/setCategory', sectionName, { root: true })
      store.commit('ui/setShowSelectSection', false)

      await this.predictPassesForSection({ section: sectionName })

      store.commit('ui/setShowPreloader', false)
    },
  },
  async created() {
    store.commit('ui/setShowPreloader', true)

    document.title = "Satellite predictor"
    const categories = await this.getCategories()

    store.commit('sattelites/setCategory', categories[0], { root: true })

    await this.predictPassesForSection({ section: categories[0] })
    await this.getUserLocation()

    store.commit('ui/setShowPreloader', false)
  },
  components: {
    AppSelectedSattelite,
    AppPredictedPasses,
    AppCompass,
    AppSunAndMoon,
    AppUserCoords,
    AppMap,
    Settings,
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
    background: var(--color-bg-light);
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
      background: var(--color-bg-light);
      font-size: 1.1rem;

      display: grid;
      grid-template-columns: 1fr auto;
      grid-gap: 15px;

      align-items: center;

      margin-bottom: 5px;
      width: 100%;

      .list {
        justify-content: flex-start;
        display: grid;
        grid-template-columns: repeat(4, auto);
        grid-gap: 20px;

        .section {
          padding: 5px 7px;
          color: var(--color-font-dark);
          cursor: pointer;

          &.selected {
            color: var(--color-accent-green);
          }
        }
      }

      .settings-icon {
        height: 20px;
        fill: var(--color-font-dark);
        cursor: pointer;
        margin: 0 10px;

        transition: all 150ms;

        &:hover {
          fill: var(--color-font-main);
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
      background: var(--color-bg-light);
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
          color: var(--color-font-dark);

          &:hover {
            color: var(--color-font-main);
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
