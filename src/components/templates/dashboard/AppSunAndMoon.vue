<template>
  <div
    class="app-sun-and-moon"
    v-if="data.moon"
  >
    <div class="object">
      <div class="header">
        <Sun />

        <div class="base-info">
          {{sun.heading}}°
          <span class="divider">|</span>
          Elev. {{sun.elevation}}°
        </div>
      </div>

      <div class="data-list">
        <div class="item">
          <div class="label">Name</div>
          <div class="label">Elev. / Bear.</div>
          <div class="label">Time</div>
        </div>

        <div
          v-for="({ label, value, midValue, marginTop }, idx) in dataList"
          v-bind:key="`item-${label}-${idx}`"
          class="item"
          :style="{
            marginTop: marginTop ? '25px' : '',
          }"
        >
          <div class="label">{{label}}</div>
          <div class="mid-value">{{midValue || "-"}}</div>
          <div class="val">{{value}}</div>
        </div>
      </div>
    </div>

    <div class="object moon">
      <div class="header">
        <Moon />

        <div class="base-info">
          {{moon.azimuth}}°
          <span class="divider">|</span>
          Elev. {{moon.altitude}}°
        </div>
      </div>

      <div class="data-list">
        <div
          v-for="({ label, value, midValue }, idx) in moonData"
          v-bind:key="`item-${label}-${idx}`"
          class="item"
        >
          <div class="label">{{label}}</div>
          <div class="mid-value">{{midValue}}</div>
          <div class="value">{{value}}</div>
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

import { TIME_FORMAT, SPEED_OF_LIGHT } from '@/core/constants'

export default {
  computed: {
    sun() {
      const degress = this.radiansToDegress(this.data.sunPosition.azimuth)
      const elevation = this.radiansToDegress(this.data.sunPosition.altitude, { isAltitude: true })

      return {
        heading: degress.toFixed(0),
        elevation: elevation.toFixed(2),
      }
    },
    dataList() {
      const {
        data: {
          sunTimes,
          sunMaxElevation,
        },
        userInfo: {
          lat = 0,
          lon = 0,
        },
      } = this

      const sunRisePosition = SunCalc.getPosition(sunTimes.sunrise, lat, lon)
      const sunSetPosition = SunCalc.getPosition(sunTimes.sunset, lat, lon)

      const dawnSunPosition = SunCalc.getPosition(sunTimes.dawn, lat, lon)
      const duskSunPosition = SunCalc.getPosition(sunTimes.dusk, lat, lon)
      const nadirSunPosition = SunCalc.getPosition(sunTimes.nadir, lat, lon)

      return [
        {
          label: 'Solar noon',
          midValue: `Elev. ${sunMaxElevation.toFixed(1)}°`,
          value: moment(sunTimes.solarNoon).format(TIME_FORMAT),
        },
        {
          label: 'Nadir',
          midValue: `Elev. ${this.radiansToDegress(nadirSunPosition.altitude, { isAltitude: true }).toFixed(1)}°`,
          value: moment(sunTimes.nadir).format(TIME_FORMAT),
        },
        {
          marginTop: true,
          label: 'Sunrise',
          midValue: `Bear. ${(this.radiansToDegress(sunRisePosition.azimuth)).toFixed(1)}°`,
          value: moment(sunTimes.sunrise).format(TIME_FORMAT),
        },
        {
          label: 'Sunset',
          midValue: `Bear. ${(this.radiansToDegress(sunSetPosition.azimuth)).toFixed(1)}°`,
          value: moment(sunTimes.sunset).format(TIME_FORMAT),
        },
        {
          marginTop: true,
          label: 'Dawn',
          midValue: `Elev. ${this.radiansToDegress(dawnSunPosition.altitude, { isAltitude: true }).toFixed(1)}°`,
          value: moment(sunTimes.dawn).format(TIME_FORMAT),
        },
        {
          label: 'Dusk',
          midValue: `Elev. ${this.radiansToDegress(duskSunPosition.altitude, { isAltitude: true }).toFixed(1)}°`,
          value: moment(sunTimes.dusk).format(TIME_FORMAT),
        },
      ]
    },
    moon() {
      const { moon } = this.data

      const altitude = this.radiansToDegress(moon.altitude, { isAltitude: true }).toFixed(2)
      const azimuth = this.radiansToDegress(moon.azimuth)

      return {
        altitude,
        azimuth: azimuth.toFixed(0),
      }
    },
    moonData() {
      const {
        moon,
        moonTimes,
        moonIll,
      } = this.data

      const { lat, lon } = this.userInfo

      const moonDistance = this.normalizeNumber(Math.round(moon.distance))
      const parallacticAngle = this.radiansToDegress(moon.parallacticAngle).toFixed(2)

      const moonPing = ((SPEED_OF_LIGHT / 1000) / moon.distance) * 2

      const dataList = [
        {
          label: 'Distance',
          midValue: `ping ${moonPing.toFixed(2)}s`,
          value: `${moonDistance}km`
        },
        { label: 'Fraction', value: moonIll.fraction.toFixed(2) },
        { label: 'Parallactic angle', value: `${parallacticAngle}°` },
      ]

      if (moonTimes.rise) {
        const moonRisePosition = SunCalc.getMoonPosition(moonTimes.rise, lat, lon)

        dataList.unshift({
          label: 'Rise',
          midValue: `Bear. ${this.radiansToDegress(moonRisePosition.azimuth).toFixed(0)}°`,
          value: moment(moonTimes.rise).format(TIME_FORMAT)
        })
      }

      if (moonTimes.set) {
        const moonSetPosition = SunCalc.getMoonPosition(moonTimes.set, lat, lon)

        dataList.unshift({
          label: 'Set',
          midValue: `Bear. ${this.radiansToDegress(moonSetPosition.azimuth).toFixed(0)}°`,
          value: moment(moonTimes.set).format(TIME_FORMAT)
        },)
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
      userInfo: {},
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

      this.userInfo = {
        lat,
        lon: long,
      }

      const times = SunCalc.getTimes(date, lat, long)
      const sunPosition = SunCalc.getPosition(date, lat, long)
      const sunrisePos = SunCalc.getPosition(times.sunrise, lat, long)
      const sunsetPos = SunCalc.getPosition(times.sunset, lat, long)

      const sunMaxElevation = SunCalc.getPosition(new Date(times.solarNoon), lat, long)

      this.data = {
        sunMaxElevation: this.radiansToDegress(sunMaxElevation.altitude, { isAltitude: true }),
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
    radiansToDegress(radians, options = {}) {
      const degress = radians * 180 / Math.PI

      return degress > 0 || options.isAltitude ? degress : degress + 360 // To account for negative result (clockwise direction)
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
  background: var(--color-bg-light);

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
        color: var(--color-font-dark);

        .divider {
          margin: 0 5px;
        }
      }
    }

    .data-list {
      font-size: 1.1rem;
      font-weight: 100;

      .item {
        display: flex;

        margin: 8px;
        display: grid;
        grid-template-columns: 2fr 130px 4fr;
        grid-gap: 15px;
        justify-content: space-between;

        .mid-value,
        .label {
          color: var(--color-font-dark);
        }

        .value {
          color: var(--color-font-main);
        }
      }
    }
  }
}
</style>
