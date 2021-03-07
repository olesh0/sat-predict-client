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

      <div
        class="text-info"
        v-if="timeItem.pass"
      >
        <div><b>max azimuth (start):</b> {{Math.round(timeItem.pass.maxAzimuth.degress)}}°</div>
        <div><b>min azimuth (end):</b> {{Math.round(timeItem.pass.minAzimuth.degress)}}°</div>
        <div><b>apex azimuth:</b> {{Math.round(timeItem.pass.apexAzimuth.degress)}}°</div>
        <div><b>max elevation:</b> {{Math.round(timeItem.pass.maxElevation)}}°</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as satellitejs from 'satellite.js'

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
    ...mapActions({
      getUserLocation: 'coords/getUserCoords',
    }),
    drawBasicCompass() {
      const getCssVariableValue = (name, element = document.getElementById('app')) =>
        getComputedStyle(element).getPropertyValue(name)

      const { ctx, canvas } = this

      const centerX = canvas.clientWidth / 2
      const centerY = canvas.clientHeight / 2

      const halfWidth = canvas.clientWidth / 2

      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = getCssVariableValue('--color-font-dark')

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
      ctx.strokeStyle = getCssVariableValue('--color-accent-red')
      ctx.arc(centerX, centerY, countDegressPercentage(15), 0, 2 * Math.PI)
      ctx.arc(centerX, centerY, countDegressPercentage(30), 0, 2 * Math.PI)
      ctx.stroke()

      // middle elevation
      ctx.beginPath()
      ctx.strokeStyle = getCssVariableValue('--color-accent-purple')
      ctx.arc(centerX, centerY, countDegressPercentage(45), 0, 2 * Math.PI)
      ctx.arc(centerX, centerY, countDegressPercentage(60), 0, 2 * Math.PI)
      ctx.stroke()

      // high elevation
      ctx.beginPath()
      ctx.strokeStyle = getCssVariableValue('--color-accent-green')
      ctx.arc(centerX, centerY, countDegressPercentage(75), 0, 2 * Math.PI)
      ctx.arc(centerX, centerY, countDegressPercentage(90), 0, 2 * Math.PI)
      ctx.stroke()
    },
    async getSatPosition({ firstRow, secondRow }, date) {
      const satrec = satellitejs.twoline2satrec(firstRow, secondRow)

      const userLocation = await this.getUserLocation()

      const gmst = satellitejs.gstime(date)
      const positionAndVelocity = satellitejs.propagate(satrec, date)

      const positionEci = positionAndVelocity.position
      const observerGd = {
        longitude: satellitejs.degreesToRadians(userLocation.lon),
        latitude: satellitejs.degreesToRadians(userLocation.lat),
        height: 0.370
      }
      const positionEcf = satellitejs.eciToEcf(positionEci, gmst)
      const lookAngles = satellitejs.ecfToLookAngles(observerGd, positionEcf)

      return lookAngles
    },
    async drawPassPath() {
      const {
        pass: {
          apexAzimuth: { degress: apexAzimuth }, // direction of elevation?
          maxElevation,
          start,
          end,
        },
        sattelite,
      } = this.timeItem

      const passStartPosition = await this.getSatPosition(sattelite, new Date(start.timestamp))
      const passEndPosition = await this.getSatPosition(sattelite, new Date(end.timestamp))

      const passStartAzimuthDegress = passStartPosition.azimuth * (180 / Math.PI)
      const passEndAzimuthDegress = passEndPosition.azimuth * (180 / Math.PI)

      const centerX = this.canvas.clientWidth / 2
      const customApexAzimuthCoordRadius = centerX - ((centerX / 100) * maxElevation)

      const appearAzimuth = this.getPointCoordsByDegress(passStartAzimuthDegress)
      const disappearAzimuth = this.getPointCoordsByDegress(passEndAzimuthDegress)
      const apexAzimuthCoord = this.getPointCoordsByDegress(apexAzimuth, customApexAzimuthCoordRadius)

      this.ctx.moveTo(appearAzimuth.x, appearAzimuth.y)

      this.ctx.quadraticCurveTo(apexAzimuthCoord.x, apexAzimuthCoord.y, disappearAzimuth.x, disappearAzimuth.y)
      this.ctx.stroke()
    },
    genPoint(centerX, centerY, degree, radius) {
      const radPerDeg = Math.PI / 180

      const x = centerX + (radius * Math.cos(degree * radPerDeg));
      const y = centerY + (radius * Math.sin(degree * radPerDeg));

      return { x, y }
    },
    getPointCoordsByDegress(degress, customRadius = null) {
      const rightAngle = 90
      const section = Math.ceil(degress / rightAngle)

      const canvasWidth = this.canvas.clientWidth
      const canvasHeight = this.canvas.clientHeight

      const centerX = canvasWidth / 2
      const centerY = canvasHeight / 2

      const { x, y } = this.genPoint(
        centerX,
        centerY,
        degress - 90,
        customRadius || centerX,
      )

      return { x, y, section }
    },
    calculateCompass() {
      this.drawBasicCompass()

      if (this.timeItem && this.timeItem.pass) {
        this.drawPassPath()
      }
    },
  },
  watch: {
    timeItem() {
      this.canvas.width = this.canvas.width

      this.calculateCompass()
    },
  },
  mounted() {
    const { compassCanvas, content } = this.$refs

    if (compassCanvas) {
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

  background: var(--color-bg-light);
  padding: 80px 20px 20px;

  .content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .text-info {
      text-align: left !important;
      margin-top: 20px;
      width: 90%;

      div {
        &, b {
          font-weight: 100;
        }

        color: var(--color-accent-green);
        margin-bottom: 5px;

        b {
          color: var(--color-font-dark);
        }
      }
    }

    .canvas-block {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-gap: 5px;

      align-items: center;
      justify-content: center;

      .heading {
        color: var(--color-font-dark);
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
        border: 1px solid var(--color-font-dark);
        border-radius: 50%;
      }
    }
  }
}
</style>
