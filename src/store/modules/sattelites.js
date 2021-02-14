import { ipcRenderer } from 'electron'

export default {
  namespaced: true,

  state: {
    categories: [],
    passes: [],
    sattelite: {},
    category: null,
  },

  getters: {
    categories: ({ categories }) => categories,
    passes: ({ passes }) => passes,
    sattelite: ({ sattelite }) => sattelite,
    category: ({ category }) => category,
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
  },

  actions: {
    async getCategories({ commit }) {
      const list = await ipcRenderer.invoke('get-categories')

      commit('setCategories', list)

      return Promise.resolve(list)
    },
    async getPredictedPasses({ commit }, sectionName) {
      const { passes } = await ipcRenderer.invoke('get-predicted-passes', sectionName)

      commit('setPasses', passes.flat())

      return Promise.resolve(passes)
    },
  },
}
