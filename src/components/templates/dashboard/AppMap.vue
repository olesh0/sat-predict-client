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
              :visible="sattelite && sattelite.latitude"
              :template="satteliteMarkerContent"
              :dataSource="[
                { latitude: sattelite.latitude, longitude: sattelite.longitude },
              ]"
              :animationDuration="500"
            ></e-markerSetting>

            <e-markerSetting
              :visible="userLocation && userLocation.lat && userLocation.lon"
              :template="userLocationMarkerContent"
              :dataSource="[
                { latitude: userLocation.lat, longitude: userLocation.lon },
              ]"
              :animationDuration="500"
            ></e-markerSetting>
          </e-markerSettings>
        </e-layer>
      </e-layers>
    </ejs-maps>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { MapsPlugin, Marker, Zoom, Highlight, Selection } from '@syncfusion/ej2-vue-maps'

import worldMap from '@/assets/world-map.json'

Vue.use(MapsPlugin)

export default Vue.extend({
  computed: {
    ...mapGetters({
      sattelite: 'sattelites/sattelite',
      userLocation: 'coords/userLocation',
    }),
  },
  methods: {
    handleMapClick: () => {},
    getCssVariableValue: (name, element = document.getElementById('app')) =>
      getComputedStyle(element).getPropertyValue(name)
  },
  data() {
    return {
      satteliteMarkerContent: () => ({
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
      userLocationMarkerContent: () => ({
        template: Vue.component('MapsComponent', {
          template: `
            <div class="marker-template user-location">
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
        fill: this.getCssVariableValue('--map-fill-color'),
        border: {
          color: this.getCssVariableValue('--map-border-color'),
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
  height: 100%;
  width: 100%;

  #maps {
    display: block;
    height: 100%;
    width: 100%;

    &, * {
      margin: 0;
      padding: 0;
    }
  }
}

.marker-template {
  border-radius: 50%;
  background: var(--color-accent-red-fade);
  border: 2px solid var(--color-accent-red);
  display: flex;
  justify-content: center;
  align-items: center;

  width: 70px;
  height: 70px;

  transition: all 1s;

  &.user-location {
    background: var(--color-accent-purple-fade);
    border-color: var(--color-accent-purple);

    width: 55px;
    height: 55px;

    .pint {
      background: var(--color-accent-purple);
    }
  }

  .point {
    width: 5px;
    height: 5px;
    background: var(--color-accent-red);
    border-radius: 4px;
  }
}
</style>
