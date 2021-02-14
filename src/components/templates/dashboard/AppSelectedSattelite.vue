<template>
  <div class="selected-sat">
    <h1>NOAA 19</h1>

    <div class="data-list">
      <div
        class="section"
        v-for="section in dataSections"
        v-bind:key="section"
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
export default {
  data() {
    return {
      dataSections: [
        [
          { label: 'Current elevation', value: '16°' },
          { label: 'Max elevation', value: '76°' },
          { label: 'Start time', value: '02/12/2021 04:25 AM' },
          { label: 'End time', value: '02/12/2021 04:35 AM' },
        ],
        [
          { label: 'Latitude', value: '48.436233°' },
          { label: 'Longtitude', value: '23.866857°' },
          { label: 'Altitude', value: '893km' },
          { label: 'Distance', value: '1364km' },
        ],
      ],
    }
  }
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
