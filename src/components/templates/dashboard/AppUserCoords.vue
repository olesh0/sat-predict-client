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
      Auto fetched location:
      <span>
        {{autoFetchedLocation.country_name}},
        {{autoFetchedLocation.city}}
      </span>
    </div>

    <div
      v-else-if="userLocation"
      class="auto-fetched-location-info"
    >
      Your current location:
      <span>
        {{userLocation.continentCode}},
        {{userLocation.countryName}},
        {{userLocation.city}}
      </span>
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

import store from '@/store'

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
        store.commit('ui/setShowPreloader', true)

        const { location } = await ipcRenderer.invoke('get-user-location') || {}

        if (!location) {
          this.coordsFetchText = 'Failed to auto-fetch the coords...'

          return
        }

        const additional = {
          country: location.country_code,
          city: location.city,
          ip: location.ip,
          timezone: location.timezone,
          languages: location.languages,
          countryName: location.country_name,
          continentCode: location.continent_code,
          utcOffset: location.utc_offset,
        }

        console.log(location)

        await this.updateUserCoords({
          ...additional,
          lat: location.latitude,
          lon: location.longitude,
        })

        if (!location.latitude || !location.longitude) {
          throw new Error('Failed to auto-fetch coords')
        }

        this.autoFetchedLocation = location
        this.updated = true
        this.coordsFetchText = 'All set.'

        this.latitude = location.latitude
        this.longtitude = location.longitude

        setTimeout(() => {
          this.updated = false
        }, 1000)
      } catch (e) {
        console.error(e)

        this.coordsFetchText = 'Failed to auto-fetch the coords...'
      } finally {
        store.commit('ui/setShowPreloader', false)
      }
    },
    async updateCoords() {
      store.commit('ui/setShowPreloader', true)

      const {
        latitude: lat,
        longtitude: lon,
      } = this

      this.autoFetchedLocation = null

      await this.updateUserCoords({ lat, lon })
      this.updated = true

      store.commit('ui/setShowPreloader', false)

      setTimeout(() => {
        this.updated = false
      }, 1000)
    },
  },
  async created() {
    await this.getUserCoords()

    if (!this.userLocation) return

    const { lat, lon } = this.userLocation

    this.latitude = lat
    this.longtitude = lon
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
      background: var(--color-bg-user-coords-input);
      border: 0;
      font-size: 1.3rem;
      color: var(--color-font-main);
      outline: none;
      margin-bottom: 20px;
      width: 100%;

      &::placeholder {
        color: var(--color-font-light);
      }
    }
  }

  .auto-fetched-location-info {
    color: var(--color-font-dark);
    margin-bottom: 30px;
    font-size: 1.05rem;

    span {
      color: var(--color-accent-purple);
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
      background: var(--color-accent-green);
      color: var(--coords-button-font-color);
      cursor: pointer;

      &.fetch-coords {
        background: var(--color-accent-red);
      }
    }
  }
}
</style>
