<template>
  <div
    class="app-sattelite-pass"
    :class="{ selected: isSelected }"
    :style="{
      'border-color': colorSchema.color,
      'background': isSelected ? colorSchema.highlight : colorSchema.transparent,
    }"
    @click="$emit('click', $event)"
  >
    <div class="sat-info">
      <div>
        <div class="name">
          <span v-if="info && info.sattelite">{{info.sattelite.satName}}</span>
          <span v-else-if="sat">{{sat.satName}}</span>

          <span
            v-if="classification && ['C', 'S'].includes(classification.value)"
            :class="[
              'sat-classification',
              classification.parsed,
            ]"
          >
            {{classification.parsed}}
          </span>
        </div>

        <div
          class="pass-in-progress"
          :class="{ show: !isSatInfo && inProgress }"
          :style="{ color: colorSchema.color }"
        >
          <div class="loader">
            <div
              v-for="className in ['first', 'middle', 'last']"
              v-bind:key="className"
              class="bar"
              :class="className"
              :style="{ background: colorSchema.color }"
            ></div>
          </div>

          <span>Pass in progress...</span>
        </div>
      </div>

      <div
        class="pass-time"
        v-if="info && info.pass"
      >{{info.pass.start.formatted}} / {{Math.round(info.pass.maxElevation || 0)}}°</div>
    </div>
  </div>
</template>

<script>
import SchemasList from "@/assets/schemas-list.json"

export default {
  data() {
    return {
      inProgress: false,
      interval: null,
    }
  },
  methods: {
    calculatePassInProgress() {
      if (this.isSatInfo) return

      const currentTime = Date.now()
      const { start, end } = this.info.pass

      const passStarted = currentTime > start.timestamp
      const passFinished = currentTime > end.timestamp

      this.inProgress = passStarted && !passFinished
    },
  },
  created() {
    if (!this.isSatInfo) {
      this.calculatePassInProgress()

      this.interval = setInterval(this.calculatePassInProgress, 1000)
    }
  },
  computed: {
    classification() {
      try {
        if (this.isSatInfo) {
          return this.sat.classification
        }

        return this.info.sattelite.details.classification
      } catch (e) {
        return {}
      }
    },
    colorSchema() {
      const generateColor = (color) => ({
        color: `var(--color-accent-${color})`,
        highlight: `var(--color-accent-${color}-fade)`,
        transparent: `var(--color-accent-${color}-ultra-fade)`,
      })

      if (this.isSatInfo) generateColor('green')

      const { maxElevation: elevationAngle } = this.info.pass

      let color

      if (elevationAngle < 30) color = 'red'
      if (elevationAngle >= 30 && elevationAngle < 60) color = 'purple'
      if (elevationAngle >= 60) color = 'green'

      return generateColor(color)
    },
  },
  props: {
    isSelected: Boolean,
    info: {
      type: Object,
      required: false,
    },
    isSatInfo: Boolean,
    sat: Object,
  },
}
</script>

<style lang="less" scoped>
.app-sattelite-pass {
  border-left: 7px solid;
  padding: 1rem .7rem;
  padding-right: 1.75rem;
  font-size: 1rem;

  cursor: pointer;

  &.selected {
    .sat-info {
      .pass-time {
        color: var(--color-font-main);
      }
    }
  }

  .sat-info {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;

    .name {
      font-size: 1.5rem;
      display: flex;
      align-items: center;

      .sat-classification {
        font-size: 1rem;
        margin-left: 10px;

        color: var(--color-accent-red);
        border: 1px solid var(--color-accent-red);
        padding: 7px;
        border-radius: 4px;
      }
    }

    .pass-time {
      color: var(--color-font-light);
    }
  }

  .pass-in-progress {
    font-size: .9rem;
    align-items: center;
    color: var(--color-accent-green);

    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 7px;

    margin-top: -20px;
    visibility: hidden;
    opacity: 0;

    transition: all 300ms;

    &.show {
      visibility: visible;
      opacity: 1;

      margin-top: 3px;
    }

    .loader {
      display: grid;
      grid-template-columns: auto auto auto;
      justify-content: center;
      align-items: center;
      grid-gap: 4px;

      .bar {
        width: 2px;
        height: 15px;
        background: var(--color-accent-green);
        border-radius: 5px;

        transition: all 300ms;
      }

      @keyframes loader {
        0%, 100% { height: 5px }
        50% { height: 15px }
      }

      @duration: 700ms;
      @halfDuration: 350ms;

      .first,
      .last {
        animation: loader @duration infinite;
      }

      .middle {
        animation: loader @duration infinite @halfDuration;
      }
    }
  }
}
</style>
