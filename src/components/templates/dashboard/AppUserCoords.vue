<template>
  <div class="app-user-coords">
    <div class="coords">
      <div>
        <label>Latitude</label>

        <input
          type="number"
          placeholder="Your Latitude..."
          v-model="latitude"
        />
      </div>

      <div>
        <label>Longtitude</label>

        <input
          type="number"
          placeholder="Your Latitude..."
          v-model="longtitude"
        />
      </div>
    </div>

    <button
      @click="updateCoords"
      class="save-button"
    >{{updated ? "Updated coords" : "Save my coords"}}</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      latitude: 0,
      longtitude: 0,
      updated: false,
    }
  },
  methods: {
    ...mapActions({
      updateUserCoords: 'coords/updateUserCoords',
    }),
    async updateCoords() {
      const {
        latitude: lat,
        longtitude: lon,
      } = this

      await this.updateUserCoords({ lat, lon })
      this.updated = true

      setTimeout(() => {
        this.updated = false
      }, 1000)
    },
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;

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

      &::placeholder {
        color: #848F97;
      }
    }
  }

  .save-button {
    margin-top: 20px;
    padding: 10px;
    border-radius: 5px;
    border: 0;
    font-size: 1.1rem;
    font-weight: 100;
    background: #22D5A4;
    color: #000;
    cursor: pointer;
  }
}
</style>
