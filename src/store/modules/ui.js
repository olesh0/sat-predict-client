import { ipcRenderer } from 'electron'

export default {
  namespaced: true,

  state: {
    showSelectSection: false,
    showPreloader: false,
    userThemeName: null,
  },

  getters: {
    showSelectSection: ({ showSelectSection }) => showSelectSection,
    showPreloader: ({ showPreloader }) => showPreloader,
    userThemeName: ({ userThemeName }) => userThemeName,
  },

  mutations: {
    setShowSelectSection(state, show) {
      state.showSelectSection = show
    },
    setShowPreloader(state, show) {
      state.showPreloader = show
    },
    setUserThemeName(state, name) {
      state.userThemeName = name
    },
  },

  actions: {
    async getUserThemeData({ commit }) {
      try {
        const data = await ipcRenderer.invoke('get-user-theme')

        if (data && data.name) {
          commit('setUserThemeName', data.name.camelCase)
        }

        return Promise.resolve(data)
      } catch (e) {
        console.error(e)

        return Promise.reject(e)
      }
    },
    async updateUserTheme({ commit }, themeName) {
      try {
        await ipcRenderer.invoke('update-user-theme', themeName)

        commit('setUserThemeName', themeName)

        return Promise.resolve(themeName)
      } catch (e) {
        console.error(e)

        return Promise.reject(e)
      }
    },
  },
}
