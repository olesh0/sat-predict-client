import vue from 'vue'
import * as vuex from 'vuex'

import sattelites from './modules/sattelites'
import ui from './modules/ui'
import coords from './modules/coords'

vue.use(vuex)

export default new vuex.Store({
  modules: {
    sattelites,
    coords,
    ui,
  },
})
