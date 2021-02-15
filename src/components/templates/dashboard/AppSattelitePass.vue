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
        <div class="name">{{info.sattelite.satName}}</div>

        <div
          class="pass-in-progress"
          :class="{ show: inProgress }"
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

      <div class="pass-time">{{info.pass.start.formatted}} / {{Math.round(info.pass.maxElevation || 0)}}°</div>
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
      const currentTime = Date.now()
      const { start, end } = this.info.pass

      const passStarted = currentTime > start.timestamp
      const passFinished = currentTime > end.timestamp

      this.inProgress = passStarted && !passFinished
    },
  },
  created() {
    this.calculatePassInProgress()

    this.interval = setInterval(this.calculatePassInProgress, 1000)
  },
  computed: {
    colorSchema() {
      const { maxElevation: elevationAngle } = this.info.pass

      if (elevationAngle < 30) return SchemasList.red
      if (elevationAngle >= 30 && elevationAngle < 60) return SchemasList.purple
      if (elevationAngle >= 60) return SchemasList.green
    },
  },
  props: {
    isSelected: Boolean,
    info: Object,
  },
}
</script>

<style lang="less" scoped>
.app-sattelite-pass {
  border-left: 7px solid;
  background: rgba(34, 213, 164, .2);
  padding: 1rem .7rem;
  padding-right: 1.75rem;
  font-size: 1rem;

  cursor: pointer;

  &.selected {
    .sat-info {
      .pass-time {
        color: #eee;
      }
    }
  }

  .sat-info {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;

    .name {
      font-size: 1.5rem;
    }

    .pass-time {
      color: #848F97;
    }
  }

  .pass-in-progress {
    font-size: .9rem;
    align-items: center;
    color: #22D5A4;

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
        background: #22D5A4;
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
