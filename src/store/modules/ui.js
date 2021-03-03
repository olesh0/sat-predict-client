export default {
  namespaced: true,

  state: {
    showSelectSection: false,
    showPreloader: false,
  },

  getters: {
    showSelectSection: ({ showSelectSection }) => showSelectSection,
    showPreloader: ({ showPreloader }) => showPreloader,
  },

  mutations: {
    setShowSelectSection(state, show) {
      state.showSelectSection = show
    },
    setShowPreloader(state, show) {
      state.showPreloader = show
    },
  },

  actions: {},
}
