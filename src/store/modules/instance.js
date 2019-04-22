import "firebase/auth"
import FirestoreApi from '../../api/firestore-api'
import { stringify } from 'querystring'

export const namespaced = true

export const state = {
  currentInstance: null,
  instances: []
}

export const mutations = {
  ADD_INSTANCE: (state, instance) => {
    console.log('mutation ADD_INSTANCE', stringify(instance))
    state.instances.push(instance)
    FirestoreApi.saveInstance(instance)
  },
  SET_INSTANCES: (state, instances) => {
    console.log('mutation SET_INSTANCES', stringify(instances))
    instances.sort((a, b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0))
    state.instances = instances
  },
  SET_CURRENT_INSTANCE: (state, instance) => {
    console.log('mutation SET_CURRENT_INSTANCE', stringify(instance))
    state.currentInstance = instance
  },
  UPDATE_INSTANCE: (state, { oldInstanceId, newInstance }) => {
    console.log('mutation UPDATE_INSTANCE', oldInstanceId, stringify(newInstance))
    let newInstanceArray = state.instances.filter(a => a.id != oldInstanceId)
    newInstanceArray.push(newInstance)
    newInstanceArray.sort((a, b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0))
    state.instances = newInstanceArray
  },
  REMOVE_INSTANCE: (state, instanceId) => {
    console.log('mutation REMOVE_INSTANCE', instanceId)
    state.instances = state.instances.filter(a => a.id != instanceId)
  },
}

export const actions = {
  createInstance: ({ commit }, instance) => {
    console.log('action createInstance', stringify(instance))
    commit('ADD_INSTANCE', instance)
  },
  loadInstances: ({ commit }) => {
    FirestoreApi.fetch('instances', false)
      .then(instances => commit('SET_INSTANCES', instances))
  },
  setCurrentInstanceById: ({ commit }, instanceId) => {
    console.log('action setCurrentInstanceById' + instanceId)
    return new Promise((resolve, reject) => {
      FirestoreApi.fetch('instances', false).then(instances => {
        let instancesArray = instances.filter(instance => instance.id == instanceId)
        if (instancesArray && instancesArray.length > 0) {
          let currInstance = instancesArray[0]
          console.log('currInstance - ' + stringify(currInstance))
          commit('SET_CURRENT_INSTANCE', currInstance)
          resolve(currInstance)
        } else {
          reject()
        }
      })
    })
  },
  updateInstance: ({ commit }, { instanceId, updatedInstance }) => {
    console.log('action updateInstance', instanceId)
    FirestoreApi.fetch('instances', true).then(instances => {
      let instanceForUpdArray = instances.filter(instance => instance.data().id == instanceId)
      if (instanceForUpdArray && instanceForUpdArray.length > 0) {
        let instanceForUpd = instanceForUpdArray[0]
        console.log('instanceForUpd', instanceForUpd.id, stringify(instanceForUpd))
        FirestoreApi.updateDoc('instances', instanceForUpd.id, updatedInstance).then(() =>
          commit('UPDATE_INSTANCE', {
            oldInstanceId: instanceId,
            newInstance: updatedInstance
          }))
      }
    })
  },
  resetCurrentInstance: ({ commit }) => {
    console.log('action resetCurrentInstance')
    return new Promise(resolve => {
      commit('SET_CURRENT_INSTANCE', null)
      resolve()
    })
  },
  deleteInstance: ({ commit }, instanceId) => {
    console.log('action deleteInstance', instanceId)
    FirestoreApi.fetch('instances', true).then(instances => {
      let instanceForDelArray = instances.filter(instance => instance.data().id == instanceId)
      if (instanceForDelArray && instanceForDelArray.length > 0) {
        let instanceForDel = instanceForDelArray[0]
        console.log('instanceForDel', instanceForDel.id +
          ' ' + stringify(instanceForDel))
        FirestoreApi.deleteDoc('instances', instanceForDel.id)
          .then(() => commit('REMOVE_INSTANCE', instanceId))
      }
    })
  }
}

export const getters = {
  getNewInstanceId: (state) => {
    if (state.instances == null || state.instances.length == 0) {
      return 0
    }
    let ids = state.instances.map(inst => inst.id)
    let newId = Math.max(...ids) + 1
    return newId
  }
}