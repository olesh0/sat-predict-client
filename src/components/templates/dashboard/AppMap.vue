<template>
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
</template>

<script>
import Vue from 'vue'
import { MapsPlugin, Marker, Zoom, Highlight, Selection } from '@syncfusion/ej2-vue-maps'

import worldMap from '@/assets/world-map.json'

Vue.use(MapsPlugin)

export default Vue.extend({
  methods: {
    handleMapClick: (args) => {
      console.log(args)
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
.app-map {
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
</style>
