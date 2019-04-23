import "firebase/auth"
import FirestoreApi from '../../api/firestore-api'
import { stringify } from 'querystring'

export const namespaced = true

export const state = {
  currentApplication: null,
  applications: []
}

export const mutations = {
  ADD_APPLICATION: (state, application) => {
    console.log('mutation ADD_APPLICATION', stringify(application))
    state.applications.push(application)
    FirestoreApi.saveApplication(application)
  },
  SET_APPLICATIONS: (state, applications) => {
    console.log('mutation SET_APPLICATIONS', stringify(applications))
    applications.sort((a, b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0))
    state.applications = applications
  },
  SET_CURRENT_APPLICATION: (state, application) => {
    console.log('mutation SET_CURRENT_APPLICATION', stringify(application))
    state.currentApplication = application
  },
  UPDATE_APPLICATION: (state, { oldApplicationId, newApplication }) => {
    console.log('mutation UPDATE_APPLICATION', oldApplicationId, stringify(newApplication))
    let newApplicationArray = state.applications.filter(a => a.id != oldApplicationId)
    newApplicationArray.push(newApplication)
    newApplicationArray.sort((a, b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0))
    state.applications = newApplicationArray
  },
  REMOVE_APPLICATION: (state, applicationId) => {
    console.log('mutation REMOVE_APPLICATION', applicationId)
    state.applications = state.applications.filter(a => a.id != applicationId)
  },
}

export const actions = {
  createApplication: ({ commit }, application) => {
    console.log('action createApplication', stringify(application))
    commit('ADD_APPLICATION', application)
  },
  loadApplications: ({ commit }) => {
    FirestoreApi.fetch('applications', false)
      .then(applications => commit('SET_APPLICATIONS', applications))
  },
  setCurrentApplicationById: ({ commit }, applicationId) => {
    console.log('action setCurrentApplicationById' + applicationId)
    return new Promise((resolve, reject) => {
      FirestoreApi.fetch('applications', false).then(applications => {
        let applicationsArray = applications.filter(application => application.id == applicationId)
        if (applicationsArray && applicationsArray.length > 0) {
          let currApplication = applicationsArray[0]
          console.log('currApplication - ' + stringify(currApplication))
          commit('SET_CURRENT_APPLICATION', currApplication)
          resolve(currApplication)
        } else {
          reject()
        }
      })
    })
  },
  updateApplication: ({ commit }, { applicationId, updatedApplication }) => {
    console.log('action updateApplication', applicationId)
    FirestoreApi.fetch('applications', true).then(applications => {
      let applicationForUpdArray = applications.filter(application => application.data().id == applicationId)
      if (applicationForUpdArray && applicationForUpdArray.length > 0) {
        let applicationForUpd = applicationForUpdArray[0]
        console.log('applicationForUpd', applicationForUpd.id, stringify(applicationForUpd))
        FirestoreApi.updateDoc('applications', applicationForUpd.id, updatedApplication).then(() =>
          commit('UPDATE_APPLICATION', {
            oldApplicationId: applicationId,
            newApplication: updatedApplication
          }))
      }
    })
  },
  resetCurrentApplication: ({ commit }) => {
    console.log('action resetCurrentApplication')
    return new Promise(resolve => {
      commit('SET_CURRENT_APPLICATION', null)
      resolve()
    })
  },
  deleteApplication: ({ commit }, applicationId) => {
    console.log('action deleteApplication', applicationId)
    FirestoreApi.fetch('applications', true).then(applications => {
      let applicationForDelArray = applications.filter(application => application.data().id == applicationId)
      if (applicationForDelArray && applicationForDelArray.length > 0) {
        let applicationForDel = applicationForDelArray[0]
        console.log('applicationForDel', applicationForDel.id +
          ' ' + stringify(applicationForDel))
        FirestoreApi.deleteDoc('applications', applicationForDel.id)
          .then(() => commit('REMOVE_APPLICATION', applicationId))
      }
    })
  }
}

export const getters = {
  getNewApplicationId: (state) => {
    if (state.applications == null || state.applications.length == 0) {
      return 0
    }
    let ids = state.applications.map(inst => inst.id)
    let newId = Math.max(...ids) + 1
    return newId
  }
}