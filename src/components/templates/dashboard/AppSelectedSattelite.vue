<template>
  <div
    class="selected-sat"
    :class="{
      unactive: !timeItem && !timeItem.sattelite && !timeItem.satName,
    }"
  >
    <div class="header">
      <h1>{{(sattelite.satName || timeItem.satName) || "-"}}</h1>

      <button @click="toggleFavorite">
        <Star
          class="star"
          :class="{ selected: favorite }"
        />
      </button>
    </div>

    <div class="data-list">
      <div
        class="section"
        v-for="(section, index) in dataSections"
        v-bind:key="index"
      >
        <div
          class="section-item"
          v-for="dataItem in section"
          v-bind:key="dataItem.label"
        >
          <div class="label">{{dataItem.label}}</div>
          <div class="value">{{dataItem.value}}</div>
        </div>
      </div>
    </div>

    <div
      class="progress"
      :class="{ show: passInProgress && progress <= 100 }"
    >
      <div
        class="bar"
        :style="{ width: `${progress}%` }"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import store from '@/store'
import Star from '@/assets/icons/Star.vue'

const __FAVORITES__ = 'Favorites'

export default {
  methods: {
    ...mapActions({
      predictPassesForSection: 'sattelites/getPredictedPasses',
      observeSattelite: 'sattelites/observeSattelite',
      getUserCoords: 'coords/getUserCoords',
      lookupFavorite: 'favorites/lookupFavorite',
      _toggleFavorite: 'favorites/toggleFavorite',
    }),
    async toggleFavorite() {
      if (!this.timeItem.sattelite && !this.timeItem.details) return

      try {
        store.commit('ui/setShowPreloader', true)

        // What is worse than this?
        const {
          noradId,
        } = this.timeItem.details ? this.timeItem.details : (this.timeItem.sattelite.details || {})

        this.favorite = await this._toggleFavorite({
          noradId,
          sectionName: this.category,
        })

        if (this.category === __FAVORITES__) {
          await this.predictPassesForSection({
            section: __FAVORITES__,
            force: true,
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        store.commit('ui/setShowPreloader', false)
      }
    },
    calculateProgress() {
      if (this.timeItem && this.timeItem.sattelite || this.timeItem.satName) {
        Promise.all([
          this.observeSattelite(this.sattelite),
          this.getUserCoords(),
        ]).then(([observeData]) => (this.observe = observeData))
      }

      if (this.passInProgress) {
        const { start, duration } = this.pass

        const durationSeconds = Math.round(duration.seconds / 1000)
        const secondsPassed = (Date.now() - start.timestamp) / 1000

        this.progress = (secondsPassed / durationSeconds) * 100
      }
    },
  },
  computed: {
    ...mapGetters({
      timeItem: 'sattelites/selectedPass',
      category: 'sattelites/category',
    }),
    passInProgress() {
      const currentTime = Date.now()
      const { start, end } = this.pass

      const passStarted = currentTime > start.timestamp
      const passFinished = currentTime > end.timestamp

      return passStarted && !passFinished
    },
    sattelite() {
      return this.timeItem && this.timeItem.sattelite || this.timeItem || {
        satName: '',
        firstRow: '',
        secondRow: '',
      }
    },
    pass() {
      return this.timeItem && this.timeItem.pass || {
        apexAzimuth: { formatted: '-' },
        duration: { formatted: '-' },
        start: { formatted: '-' },
        end: { formatted: '-' },
        minAzimuth: { formatted: '-' },
        maxAzimuth: { formatted: '-' },
        maxElevation: 0,
        maxElevationTime: { formatted: '-' },
      }
    },
    dataSections() {
      return [
        [
          { label: 'Current elevation', value: `${(this.observe.elevation || 0).toFixed(1)}°` },
          { label: 'Current azimuth', value: `${(this.observe.azimuth || 0).toFixed(1)}°` },
          { label: 'Range', value: `${Math.round(this.observe.rangeSat || 0)}km` },
          { label: 'Latitude', value: (this.observe.latitude || 0).toFixed(6) },
          { label: 'Longitude', value: (this.observe.longitude || 0).toFixed(6) },
        ],
        [
          { label: 'Max elevation', value: `${Math.round(this.pass.maxElevation || 0)}°` },
          { label: 'Start time', value: this.pass.start.formatted },
          { label: 'End time', value: this.pass.end.formatted },
          { label: 'Pass duration', value: this.pass.duration.formatted },
          { label: 'Altitude', value: this.observe.altitude ? `${Math.round(this.observe.altitude)}km` : '-' },
        ],
      ]
    },
  },
  data() {
    return {
      interval: null,
      progress: 0,
      observe: {},
      favorite: null,
    }
  },
  watch: {
    async timeItem() {
      if (this.timeItem && this.timeItem.pass) {
        this.calculateProgress()
      }

      try {
        // This is so bad. It'd probably worth it just to create an additional component
        const { noradId } = this.timeItem && this.timeItem.sattelite
          ? this.timeItem.sattelite.details
          : this.timeItem.details

        this.favorite = await this.lookupFavorite(noradId)
      } catch (e) {
        console.log('Failed to lookup for favorite')
        console.error(e)
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  created() {
    this.interval = setInterval(this.calculateProgress, 1000)
  },
  components: {
    Star,
  },
}
</script>

<style lang="less" scoped>
.selected-sat {
  opacity: 1;

  &.unactive {
    opacity: .2;
    cursor: default;
  }

  transition: all .3s;

  .header {
    display: flex;
    justify-content: space-between;

    h1 {
      margin: 0;
      padding: 0;

      font-size: 2rem;
    }

    button {
      border: none;
      background: transparent;
      outline: none;
      cursor: pointer;

      .star {
        stroke: var(--color-font-dark);
        fill: none;

        transition: all .15s;

        &.selected {
          fill: var(--color-accent-green);
          stroke: var(--color-accent-green);
        }
      }
    }
  }

  .data-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 50px;

    font-weight: 100;
    margin-top: 20px;

    .section {
      .section-item {
        margin-bottom: 10px;
        font-size: 1rem;

        display: flex;
        justify-content: space-between;

        .label {
          color: var(--color-font-dark);
        }

        .value {
          color: var(--color-accent-green);
        }
      }
    }
  }

  .progress {
    width: 100%;
    height: 2px;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 0px;

    visibility: hidden;
    opacity: 0;

    background: var(--color-accent-red-ultra-fade);
    transition: all 300ms;

    &.show {
      visibility: visible;
      opacity: 1;

      margin-top: 10px;
    }

    .bar {
      width: 30%;
      height: 100%;

      background: var(--color-accent-red);
      transition: all 700ms;
    }
  }
}
</style>
