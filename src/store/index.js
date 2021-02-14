import vue from 'vue'
import * as vuex from 'vuex'
import sattelites from './modules/sattelites'

vue.use(vuex)

export default new vuex.Store({
  modules: {
    sattelites,
  },
})
