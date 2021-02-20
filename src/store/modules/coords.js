import { ipcRenderer } from 'electron'

export default {
  namespaced: true,

  state: {
    userLocation: { lat: 0, lon: 0 },
  },

  getters: {
    userLocation: ({ userLocation }) => userLocation,
  },

  mutations: {
    setUserLocation(state, location) {
      state.userLocation = location
    },
  },

  actions: {
    async updateUserCoords(_, coords) {
      const coordsUpdate = await ipcRenderer.invoke('update-user-coords', coords)

      return Promise.resolve(coordsUpdate)
    },
    async getUserCoords({ commit }) {
      const userCoords = await ipcRenderer.invoke('get-user-coords')

      commit('setUserLocation', userCoords)

      return Promise.resolve(userCoords)
    },
  },
}
