<template>
  <div class="map-wrapper">
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

    <div class="app-map">
      <ejs-maps
        id="maps"
        :zoomSettings="{
          enable: true,
          toolbars: [],
          pinchZooming: true,
        }"
        :itemSelection="handleMapClick"
      >
        <e-layers>
          <e-layer
            :shapeData="shapeData"
            :scale="1"
            :shapeSettings="shapeSettings"
            :layerType="layerType"
            :animationDuration="1500"
          >
            <e-markerSettings>
              <e-markerSetting
                :visible="true"
                :template="contentTemplate"
                :dataSource="[
                  { latitude: 48.522640, longitude: 25.036758 }
                ]"
                :animationDuration="0"
              ></e-markerSetting>
            </e-markerSettings>
          </e-layer>
        </e-layers>
      </ejs-maps>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { MapsPlugin, Marker, Zoom, Highlight, Selection } from '@syncfusion/ej2-vue-maps'

import store from '@/store'
import worldMap from '@/assets/world-map.json'

Vue.use(MapsPlugin)

export default Vue.extend({
  computed: {
    ...mapGetters({
      showSelectSection: 'ui/showSelectSection',
      categories: 'sattelites/categories',
    }),
  },
  methods: {
    ...mapActions({
      predictPassesForSection: 'sattelites/getPredictedPasses',
    }),
    handleMapClick: (args) => {
      console.log(args)
    },
    async loadSection(sectionName) {
      store.commit('sattelites/setCategory', sectionName, { root: true })
      store.commit('ui/setShowSelectSection', false)

      await this.predictPassesForSection(sectionName)
    },
  },
  data() {
    return {
      contentTemplate: () => ({
        template: Vue.component('MapsComponent', {
          template: `
            <div class="marker-template">
              <div class="point" />
            </div>
          `,
          data() {
            return {}
          }
        }),
      }),
      shapeData: worldMap,
      layerType: 'Geometry',
      shapeSettings: {
        fill: '#191A1A',
        border: {
          color: '#454545',
          width: 1,
        }
      },
    }
  },
  provide: {
    maps: [Marker, Zoom, Highlight, Selection],
  },
})
</script>

<style lang="less">
.map-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

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

  .app-map {
    height: 100%;
    width: 100%;

    #maps {
      display: block;
      height: 100%;
      width: 100%;

      background: #000;
    }

    .marker-template {
      border-radius: 20px;
      width: 80px;
      height: 80px;
      background: rgba(213, 34, 34, .2);
      border: 2px solid rgba(213, 34, 34, .8);
      display: flex;

      .point {
        margin: auto;
        width: 5px;
        height: 5px;
        background: rgba(213, 34, 34, 1);
        border-radius: 4px;
      }
    }
  }
}
</style>
