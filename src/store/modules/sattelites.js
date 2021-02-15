import { isCustomPath } from '@syncfusion/ej2-vue-maps'
import { ipcRenderer } from 'electron'

export default {
  namespaced: true,

  state: {
    categories: [],
    passes: [],
    sattelite: {},
    category: null,
    selectedPass: null,
  },

  getters: {
    categories: ({ categories }) => categories,
    passes: ({ passes }) => passes,
    sattelite: ({ sattelite }) => sattelite,
    category: ({ category }) => category,
    selectedPass: ({ selectedPass }) => selectedPass,
  },

  mutations: {
    setCategories(state, list) {
      state.categories = list
    },
    setPasses(state, list) {
      state.passes = list
    },
    setSattelite(state, sat) {
      state.sattelite = sat
    },
    setCategory(state, cat) {
      state.category = cat
    },
    setSelectedPass(state, pass) {
      state.selectedPass = pass
    },
  },

  actions: {
    async observeSattelite({ commit }, sattelite) {
      const data = await ipcRenderer.invoke('observe-sattelite', sattelite)

      commit('setSattelite', data)

      return Promise.resolve(data)
    },
    async getCategories({ commit }) {
      const list = await ipcRenderer.invoke('get-categories')
      const sortedList = list.sort()

      commit('setCategories', sortedList)

      return Promise.resolve(sortedList)
    },
    async getPredictedPasses({ commit }, sectionName) {
      const { passes: passesRaw } = await ipcRenderer.invoke('get-predicted-passes', sectionName)
      const currentTime = Date.now()

      const inProgress = (pass) => {
        return Date.now() > pass.start.timestamp && Date.now() < pass.end.timestamp
      }

      const passes =
        passesRaw
          .flat()
          .filter(({ pass }) => (currentTime - 180000) < pass.start.timestamp || inProgress(pass)) // not older than 3 minutes
          .sort((a, b) => {
            return a.pass.maxElevationTime.timestamp - b.pass.maxElevationTime.timestamp
          })

      commit('setPasses', passes)

      return Promise.resolve(passes)
    },
  },
}
