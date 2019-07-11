import Vue from 'vue'
import Vuex from 'vuex'
import "firebase/auth"
import * as form from './modules/form'
import * as application from './modules/application'
import * as template from './modules/template'
import * as user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    form,
    application,
    template,
    user
  }
})
