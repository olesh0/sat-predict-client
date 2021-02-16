<template>
  <div class="app-compass">
    <div class="content" ref="content">
      <canvas ref="compassCanvas">
        If you see this text, then you either look into the code, or electron is being weird...
      </canvas>

      <pre>
        {{timeItem.pass}}
      </pre>
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
  mounted() {
    const { compassCanvas, content } = this.$refs

    if (compassCanvas) {
      console.log(this.$refs.compassCanvas)

      compassCanvas.width = content.clientWidth - 50
      compassCanvas.height = content.clientWidth - 50

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
    max-height: 80vh;
    overflow: auto;

    text-align: center;

    canvas {
      background: rgba(0, 0, 0, .15);
      border: 2px solid #22D5A4;
      border-radius: 50%;
    }
  }
}
</style>
