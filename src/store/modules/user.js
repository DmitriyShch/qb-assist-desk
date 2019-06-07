import { stringify } from "querystring";
import firebase from '../../api/firebase'

export const state = {
  user: null,
  /*
  -2 - not stated
  -1 - is stating
  0  - not logined
  1  - logined
  */
  loginState: -2 // 
}

export const mutations = {
  SET_USER: (state, user) => {
    console.log('mutations_SET_USER', user.email)
    state.user = user
    if (user != null) {
      state.loginState = 1
    }
  },
  CLEAR_USER: (state) => {
    console.log('mutations_CLEAR_USER')
    state.user = null
    state.loginState = 0
  },
  SET_LOGIN_STATE: (state, loginState) => {
    console.log('mutations_SET_LOGIN_STATE - loginState', loginState)
    state.loginState = loginState
  },
}

export const actions = {
  SIGN_IN: ({ commit, state }, callback) => {
    console.log('action SIGN_IN')
    if (state.user != null) {
      return
    }

    if (state.isLogined == -2) {
      commit('SET_LOGIN_STATE', -1)
    }
    
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        var user = result.user
        if (user != null) {
          console.log(user.email)
          // [START_EXCLUDE]
          commit('SET_USER', user)

          console.log("stringify(result.credential)")
          console.log(stringify(result.credential))


          // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            console.log("idToken - SIGN_IN")
            console.log(idToken)
            // firebase.auth().signInWithCustomToken(idToken)
          }).catch(function(error) {
            console.error(error)
          });


          // console.log(callback)
          callback && callback()
        } else {
          commit('SET_LOGIN_STATE', 0)
          console.warn('login failed')
        }
      })
      .catch(err => {
        console.error(err)
        commit('CLEAR_USER')
      })
  },
  SIGN_OUT: ({ commit }, callback) => {
    console.log('action SIGN_OUT')
    firebase.auth().signOut()
      .then(function() {
        commit('CLEAR_USER')
        callback && callback()
      })
  },
  checkLogin: ({ commit }, { callbackSignIn, callbackSignOut }) => {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        console.log('onAuthStateChanged - user -', user != undefined);
        if (user) {
          console.log('User is logined', stringify(user.email));
          commit('SET_USER', user)
          if (callbackSignIn) {
            callbackSignIn()
          }



          firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            console.log("idToken - checkLogin")
            console.log(idToken)
          }).catch(function(error) {
            console.error(error)
          });



          resolve(user.email)
        } else {
          console.log('User is not logged in.');
          commit('CLEAR_USER')
          if (callbackSignOut) {
            callbackSignOut()
          }
          reject('Not logged in')
        }
      })
    })
  }
}

export const getters = {
  userIsLogged: (state) => {
    return !!state.user
  },
  userLoginState: (state) => {
    return state.loginState
  },
  userInfo: (state) => {
    console.log('userInfo - ', !!(state.user))
    return state.user != null ? state.user.email : ''
  }
}