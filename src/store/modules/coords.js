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
    async updateUserCoords({ rootGetters, dispatch, commit }, coords) {
      const coordsUpdate = await ipcRenderer.invoke('update-user-coords', coords)

      if (!coordsUpdate) return

      await dispatch(
        'sattelites/getPredictedPasses',
        { section: rootGetters['sattelites/category'], force: true },
        { root: true }
      )

      commit('setUserLocation', coords)

      return Promise.resolve(coords)
    },
    async getUserCoords({ commit }) {
      const userCoords = await ipcRenderer.invoke('get-user-coords')

      commit('setUserLocation', userCoords)

      return Promise.resolve({
        lat: Number(userCoords.lat),
        lon: Number(userCoords.lon),
      })
    },
  },
}
