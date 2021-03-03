import { ipcRenderer } from 'electron'

const __FAVORITES__ = 'Favorites'

export default {
  namespaced: true,

  state: {
    categories: [],
    passes: [],
    satsList: [],
    sattelite: {},
    category: null,
    selectedPass: {},
  },

  getters: {
    categories: ({ categories }) => categories,
    passes: ({ passes }) => passes,
    sattelite: ({ sattelite }) => sattelite,
    category: ({ category }) => category,
    selectedPass: ({ selectedPass }) => selectedPass,
    satsList: ({ satsList }) => satsList,
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
    setSatsList(state, sats) {
      state.satsList = sats
    },
  },

  actions: {
    async observeSattelite({ commit }, sattelite) {
      const data = await ipcRenderer.invoke('observe-sattelite', sattelite)

      if (data.error) {
        console.error(data.error)

        return Promise.resolve([])
      }

      commit('setSattelite', data)

      return Promise.resolve(data)
    },
    async getCategories({ commit }) {
      const list = await ipcRenderer.invoke('get-categories')
      const sortedList = list.sort()

      if (list.error) {
        console.error(data.error)

        return Promise.resolve([])
      }

      commit('setCategories', sortedList)

      return Promise.resolve(sortedList)
    },
    async getPredictedPasses({ commit }, { section, force = false }) {
      commit('setSatsList', [])
      commit('setPasses', [])

      const data = await ipcRenderer.invoke('get-predicted-passes', { section, force })
      const currentTime = Date.now()

      if (data.error) {
        console.error(data.error)

        return Promise.resolve([])
      }

      console.log(data)

      if (section === __FAVORITES__) {
        return commit('setSatsList', data.sats || [])
      }

      const { passes: passesRaw } = data

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
