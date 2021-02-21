<template>
  <div class="app-user-coords">
    <div class="coords">
      <div>
        <label>Latitude</label>

        <input
          type="number"
          placeholder="Your Latitude..."
          v-model="latitude"
          v-on:paste="handlePaste"
        />
      </div>

      <div>
        <label>Longtitude</label>

        <input
          type="number"
          placeholder="Your Latitude..."
          v-model="longtitude"
          v-on:paste="handlePaste"
        />
      </div>
    </div>

    <div
      v-if="autoFetchedLocation"
      class="auto-fetched-location-info"
    >
      Auto fetched location: <span>{{autoFetchedLocation.country_name}}, {{autoFetchedLocation.city}}</span>
    </div>

    <div class="actions">
      <button
        @click="updateCoords"
        class="save-button"
      >{{updated ? "Updated coords" : "Save my coords"}}</button>

      <div>
        <button
          v-if="!coordsFetchText"
          @click="autoFetchCoords"
          class="save-button fetch-coords"
        >Auto-fetch coords</button>

        <div
          v-else
          class="coords-fetch-fail"
        >{{coordsFetchText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  data() {
    return {
      latitude: 0,
      longtitude: 0,
      updated: false,
      coordsFetchText: null,
      autoFetchedLocation: null,
    }
  },
  computed: {
    ...mapGetters({
      userLocation: 'coords/userLocation',
    }),
  },
  watch: {
    userLocation() {
      if (this.userLocation && this.userLocation.lat) {
        const { lat, lon } = this.userLocation

        this.latitude = lat
        this.longtitude = lon
      }
    },
  },
  methods: {
    ...mapActions({
      updateUserCoords: 'coords/updateUserCoords',
      getUserCoords: 'coords/getUserCoords',
    }),
    handlePaste() {
      navigator
        .clipboard
        .readText()
        .then((clipBoardText) => {
          this.autoFetchedLocation = null

          if (!clipBoardText) return

          // Basic test for coords being copied from Google Maps
          const coordsTest = clipBoardText.split(', ')

          if (coordsTest.length < 2) return

          const [lat, lon] = coordsTest

          this.latitude = lat
          this.longtitude = lon
        })
    },
    async autoFetchCoords() {
      try {
        const { location } = await ipcRenderer.invoke('get-user-location')

        await this.updateUserCoords({
          lat: location.latitude,
          lon: location.longitude,
        })

        this.autoFetchedLocation = location
        this.updated = true
        this.coordsFetchText = 'All set.'

        setTimeout(() => {
          this.updated = false
        }, 1000)
      } catch (e) {
        console.error(e)

        this.coordsFetchText = 'Failed to auto-fetch the coords...'
      }
    },
    async updateCoords() {
      const {
        latitude: lat,
        longtitude: lon,
      } = this

      this.autoFetchedLocation = null

      await this.updateUserCoords({ lat, lon })
      this.updated = true

      setTimeout(() => {
        this.updated = false
      }, 1000)
    },
  },
  created() {
    this.getUserCoords()
  },
  name: 'app-user-coords',
}
</script>

<style lang="less" scoped>
.app-user-coords {
  padding: 80px 20px 20px;

  input, button {
    font-family: 'Orbitron';
  }

  * {
    box-sizing: border-box;
  }

  .coords {
    label {
      font-size: 1rem;
      color: #848F97;
      margin-bottom: 5px;
      display: block;
    }

    input {
      padding: 15px;
      border-radius: 5px;
      background: rgba(255, 255, 255, .04);
      border: 0;
      font-size: 1.3rem;
      color: #FFF;
      outline: none;
      margin-bottom: 20px;
      width: 100%;

      &::placeholder {
        color: #848F97;
      }
    }
  }

  .auto-fetched-location-info {
    color: rgba(255, 255, 255, .2);
    margin-bottom: 30px;
    font-size: 1.1rem;

    span {
      color: #8E22D5;
    }
  }

  .actions {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 20px;

    align-items: center;
    margin-top: 20px;

    .save-button {
      padding: 10px;
      border-radius: 5px;
      border: 0;
      font-size: 1.1rem;
      font-weight: 100;
      background: #22D5A4;
      color: #000;
      cursor: pointer;

      &.fetch-coords {
        background: rgba(213, 34, 34, 1);
      }
    }
  }
}
</style>