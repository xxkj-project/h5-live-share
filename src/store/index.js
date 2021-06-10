import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import globalStatus from './modules/globalStatus'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    globalStatus
  }
})
