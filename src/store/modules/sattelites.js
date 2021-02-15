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
    async getCategories({ commit }) {
      const list = await ipcRenderer.invoke('get-categories')
      const sortedList = list.sort()

      commit('setCategories', sortedList)

      return Promise.resolve(sortedList)
    },
    async getPredictedPasses({ commit }, sectionName) {
      const { passes: passesRaw } = await ipcRenderer.invoke('get-predicted-passes', sectionName)
      const passes = passesRaw.flat().sort((a, b) => {
        return a.pass.maxElevationTime.timestamp - b.pass.maxElevationTime.timestamp
      })

      commit('setPasses', passes)

      return Promise.resolve(passes)
    },
  },
}
