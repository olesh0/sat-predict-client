import vue from 'vue'
import * as vuex from 'vuex'

import sattelites from './modules/sattelites'
import ui from './modules/ui'

vue.use(vuex)

export default new vuex.Store({
  modules: {
    sattelites,
    ui,
  },
})
