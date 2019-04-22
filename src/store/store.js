import Vue from 'vue'
import Vuex from 'vuex'
import "firebase/auth"
import * as channel from './modules/channel'
import * as instance from './modules/instance'
import * as user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    channel,
    instance,
    user
  }
})
