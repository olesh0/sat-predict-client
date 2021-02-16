<template>
  <div class="app-compass">
    <div class="content" ref="content">
      <div class="canvas-block">
        <div class="vertical-heading">
          <div>W</div>
          <div>270°</div>
        </div>

        <div>
          <div class="horizontal-heading">N 0°</div>

          <canvas ref="compassCanvas">
            If you see this text, then you either look into the code, or electron is being weird...
          </canvas>

          <div class="horizontal-heading">S 180°</div>
        </div>

        <div class="vertical-heading">
          <div>E</div>
          <div>90°</div>
        </div>
      </div>

      <!-- <div class="text-info">
        <pre>
          {{timeItem.pass}}
        </pre>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    canvas() {
      return this.$refs.compassCanvas
    },
    ctx() {
      const { canvas } = this

      return canvas.getContext('2d')
    },
    ...mapGetters({
      timeItem: 'sattelites/selectedPass',
    }),
  },
  methods: {
    drawBasicCompass() {
      const { ctx, canvas } = this

      const centerX = canvas.clientWidth / 2
      const centerY = canvas.clientHeight / 2

      const halfWidth = canvas.clientWidth / 2

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(34, 213, 164, 1)'
      ctx.lineWidth = 1

      // Cross
      ctx.moveTo(centerX, 0)
      ctx.lineTo(centerX, canvas.clientHeight)
      ctx.stroke()

      ctx.moveTo(0, centerY)
      ctx.lineTo(canvas.clientWidth, centerY)
      ctx.stroke()

      // Elevation circles
      const countDegressPercentage = (deg) => halfWidth - ((halfWidth / 100) * deg)

      // low elevation
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(213, 34, 34, .5)'
      ctx.arc(centerX, centerY, countDegressPercentage(15), 0, 2 * Math.PI)
      ctx.arc(centerX, centerY, countDegressPercentage(30), 0, 2 * Math.PI)
      ctx.stroke()

      // middle elevation
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(142, 34, 213, .5)'
      ctx.arc(centerX, centerY, countDegressPercentage(45), 0, 2 * Math.PI)
      ctx.arc(centerX, centerY, countDegressPercentage(60), 0, 2 * Math.PI)
      ctx.stroke()

      // high elevation
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(34, 213, 164, .5)'
      ctx.arc(centerX, centerY, countDegressPercentage(75), 0, 2 * Math.PI)
      ctx.arc(centerX, centerY, countDegressPercentage(90), 0, 2 * Math.PI)
      ctx.stroke()
    },
    calculateCompass() {
      this.drawBasicCompass()
    },
  },
  watch: {
    timeItem() {
      this.calculateCompass()
    },
  },
  mounted() {
    const { compassCanvas, content } = this.$refs

    if (compassCanvas) {
      console.log(this.$refs.compassCanvas)

      compassCanvas.width = content.clientWidth - 130
      compassCanvas.height = content.clientWidth - 130

      this.calculateCompass()
    }
  },
  name: 'app-compass',
}
</script>

<style lang="less" scoped>
.app-compass {
  width: 100%;
  height: 100%;

  background: #242729;
  padding: 80px 20px 20px;

  .content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .canvas-block {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-gap: 5px;

      align-items: center;
      justify-content: center;

      .heading {
        color: #5F6D77;
        font-size: 1rem;
        text-align: center;
      }

      .vertical-heading {
        margin: 0 5px;
        .heading();
      }

      .horizontal-heading {
        margin: 10px 0;
        .heading();
      }

      canvas {
        background: rgba(0, 0, 0, .15);
        border: 2px solid #22D5A4;
        border-radius: 50%;
      }
    }
  }
}
</style>
