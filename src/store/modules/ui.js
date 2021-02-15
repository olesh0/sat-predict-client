export default {
  namespaced: true,

  state: {
    showSelectSection: false,
  },

  getters: {
    showSelectSection: ({ showSelectSection }) => showSelectSection,
  },

  mutations: {
    setShowSelectSection(state, show) {
      state.showSelectSection = show
    },
  },

  actions: {},
}
