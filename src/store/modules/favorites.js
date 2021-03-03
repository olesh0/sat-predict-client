import { ipcRenderer } from 'electron'

export default {
  namespaced: true,

  state: {},

  getters: {},

  mutations: {},

  actions: {
    async lookupFavorite(_, noradId) {
      return ipcRenderer.invoke('lookup-favorite', noradId)
    },
    async toggleFavorite(_, data) {
      return ipcRenderer.invoke('toggle-favorite', data)
    },
  },
}
