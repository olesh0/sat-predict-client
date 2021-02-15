<template>
  <div class="selected-sat">
    <h1>{{sattelite.satName || "-"}}</h1>

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

    <div class="progress">
      <div class="bar" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      timeItem: 'sattelites/selectedPass',
    }),
    sattelite() {
      return this.timeItem && this.timeItem.sattelite || {
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
          { label: 'Current elevation', value: '16°' },
          { label: 'Max elevation', value: `${Math.round(this.pass.maxElevation || 0)}°` },
          { label: 'Start time', value: this.pass.start.formatted },
          { label: 'End time', value: this.pass.end.formatted },
        ],
        [
          { label: 'Latitude', value: '48.436233°' },
          { label: 'Longtitude', value: '23.866857°' },
          { label: 'Altitude', value: '893km' },
          { label: 'Pass duration', value: this.pass.duration.formatted },
        ],
      ]
    },
  },
  watch: {
    timeItem() {
      console.log(this.timeItem)
    },
  },
  created() {
    console.log(this.pass)
  },
}
</script>

<style lang="less" scoped>
.selected-sat {
  h1 {
    margin: 0;
    padding: 0;

    font-size: 2rem;
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
          color: #5F6D77;
        }

        .value {
          color: #22D5A4;
        }
      }
    }
  }

  .progress {
    width: 100%;
    height: 3px;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 20px;

    background: rgba(213, 34, 34, .2);

    .bar {
      width: 30%;
      height: 100%;

      background: rgb(213, 34, 34);
    }
  }
}
</style>
