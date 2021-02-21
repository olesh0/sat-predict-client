<template>
  <div
    class="app-sun-and-moon"
    v-if="data.moon"
  >
    <div class="object">
      <div class="header">
        <Sun />

        <div class="base-info">
          {{sunHeading}}
          <span class="divider">|</span>
          {{sunAltitude}}°
        </div>
      </div>

      <div class="data-list">
        <div
          v-for="({ label, value }, idx) in dataList"
          v-bind:key="`item-${label}-${idx}`"
          class="item"
        >
          <div class="label">{{label}}</div>
          <div class="val">{{value}}</div>
        </div>
      </div>
    </div>

    <div class="object moon">
      <div class="header">
        <Moon />

        <div class="base-info">
          {{moon.azimuth}}
          <span class="divider">|</span>
          {{moon.altitude}}°
        </div>
      </div>

      <div class="data-list">
        <div
          v-for="({ label, value }, idx) in moonData"
          v-bind:key="`item-${label}-${idx}`"
          class="item"
        >
          <div class="label">{{label}}</div>
          <div class="val">{{value}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SunCalc from 'suncalc'
import _normalizeBearing from 'quadrant-bearing'
import moment from 'moment'

import Moon from '@/assets/icons/Moon.vue'
import Sun from '@/assets/icons/Sun.vue'
import { mapActions } from 'vuex'

const TIME_FORMAT = "DD/MM HH:mm:ss A"

export default {
  computed: {
    sunHeading() {
      const degress = Math.round(this.radiansToDegress(this.data.sunPosition.azimuth))

      return this.normalizeBearing(degress < 0 ? degress + 360 : degress)
    },
    sunAltitude() {
      const radiansAltitude = this.radiansToDegress(this.data.sunPosition.altitude)

      return radiansAltitude.toFixed(2)
    },
    dataList() {
      const {
        data: {
          sunTimes,
          sunMaxElevation,
        },
      } = this

      return [
        { label: 'Solar noon', value: `${moment(sunTimes.solarNoon).format(TIME_FORMAT)} / ${sunMaxElevation.toFixed(3)}°` },
        { label: 'Sunrise', value: moment(sunTimes.sunrise).format(TIME_FORMAT) },
        { label: 'Sunset', value: moment(sunTimes.sunset).format(TIME_FORMAT) },
        { label: 'Dawn', value: moment(sunTimes.dawn).format(TIME_FORMAT) },
        { label: 'Dusk', value: moment(sunTimes.dusk).format(TIME_FORMAT) },
        { label: 'Nadir', value: moment(sunTimes.nadir).format(TIME_FORMAT) },
      ]
    },
    moon() {
      const { moon } = this.data

      const altitude = this.radiansToDegress(moon.altitude).toFixed(2)
      const azimuth = this.radiansToDegress(moon.azimuth)

      return {
        altitude,
        azimuth: this.normalizeBearing(Math.round(azimuth < 0 ? azimuth + 360 : azimuth)),
      }
    },
    moonData() {
      const {
        moon,
        moonTimes,
        moonIll,
      } = this.data

      const moonDistance = this.normalizeNumber(Math.round(moon.distance))
      const parallacticAngle = this.radiansToDegress(moon.parallacticAngle).toFixed(2)

      const dataList = [
        { label: 'Distance', value: `${moonDistance}km` },
        { label: 'Fraction', value: moonIll.fraction.toFixed(2) },
        { label: 'Parallactic angle', value: `${parallacticAngle}°` },
      ]

      if (moonTimes.rise) {
        dataList.unshift({ label: 'Rise', value: moment(moonTimes.rise).format(TIME_FORMAT) })
      }

      if (moonTimes.set) {
        dataList.unshift({ label: 'Set', value: moment(moonTimes.set).format(TIME_FORMAT) },)
      }

      if (moonTimes.alwaysUp || moonTimes.alwaysDown) {
        const isUp = moonTimes.alwaysUp && 'Moon is always up'
        const isDown = moonTimes.alwaysDown && 'Moon is always down'

        dataList.unshift({
          label: 'Fact',
          value: isUp || isDown,
        })
      }

      return dataList
    },
  },
  data() {
    return {
      data: {},
      interval: null,
    }
  },
  methods: {
    ...mapActions({
      getUserCoords: 'coords/getUserCoords',
    }),
    normalizeBearing: _normalizeBearing,
    normalizeNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    async getRiseSetInfo() {
      const { lat, lon: long } = await this.getUserCoords()
      const date = new Date()

      const times = SunCalc.getTimes(date, lat, long)
      const sunPosition = SunCalc.getPosition(date, lat, long)
      const sunrisePos = SunCalc.getPosition(times.sunrise, lat, long)
      const sunsetPos = SunCalc.getPosition(times.sunset, lat, long)

      const sunMaxElevation = SunCalc.getPosition(new Date(times.solarNoon), lat, long)

      this.data = {
        sunMaxElevation: this.radiansToDegress(sunMaxElevation.altitude),
        moonTimes: SunCalc.getMoonTimes(date, lat, long),
        moon: SunCalc.getMoonPosition(date, lat, long),
        moonIll: SunCalc.getMoonIllumination(date, lat, long),
        sunrisePos: this.radiansToDegress(sunrisePos.azimuth),
        sunsetPos: this.radiansToDegress(sunsetPos.azimuth),
        sunriseAzimuth: this.radiansToDegress(sunrisePos.azimuth),
        sunTimes: times,
        sunPosition,
      }
    },
    radiansToDegress(radians) {
      return radians * 180 / Math.PI
    },
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  created() {
    this.getRiseSetInfo()

    this.interval = setInterval(this.getRiseSetInfo, 5000)
  },
  components: {
    Moon,
    Sun,
  },
  name: 'app-sun-and-moon',
}
</script>

<style lang="less" scoped>
.app-sun-and-moon {
  padding: 80px 20px 20px;
  background: #242729;

  .object {
    &.moon {
      margin-top: 40px;
    }

    .header {
      display: grid;
      grid-template-columns: 70px auto;
      grid-gap: 20px;
      justify-content: space-between;

      align-items: center;
      margin-bottom: 20px;

      .base-info {
        color: #5F6D77;

        .divider {
          margin: 0 5px;
        }
      }
    }

    .data-list {
      font-size: 1.1rem;
      font-weight: 100;

      .item {
        margin-bottom: 10px;
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: 15px;
        justify-content: flex-start;

        .label {
          color: #5F6D77;
        }

        .value {
          color: #eee;
        }
      }
    }
  }
}
</style>
