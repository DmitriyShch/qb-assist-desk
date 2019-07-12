import "firebase/auth"
import FirestoreApi from '../../api/firestore-api'
import template_api from '../../api/project-templates-api'
import { stringify } from 'querystring'

export const namespaced = true

export const state = {
  // currentTemplate: null,
  templates: []
}

export const mutations = {
  ADD_TEMPLATE: (state, template) => {
    console.log('mutation ADD_TEMPLATE', stringify(template))
    state.templates.push(template)
    FirestoreApi.saveTemplate(template)
  },
  SET_TEMPLATES: (state, templates) => {
    console.log('mutation SET_TEMPLATES', stringify(templates))
    templates.sort((a, b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0))
    state.templates = templates
  },
  // SET_CURRENT_TEMPLATE: (state, template) => {
  //   console.log('mutation SET_CURRENT_TEMPLATE', stringify(template))
  //   state.currentTemplate = template
  // },
  UPDATE_TEMPLATE: (state, { oldTemplateId, newTemplate }) => {
    console.log('mutation UPDATE_TEMPLATE', oldTemplateId, stringify(newTemplate))
    let newTemplateArray = state.templates.filter(a => a.id != oldTemplateId)
    newTemplateArray.push(newTemplate)
    newTemplateArray.sort((a, b) => (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0))
    state.templates = newTemplateArray
  },
  REMOVE_TEMPLATE: (state, templateId) => {
    console.log('mutation REMOVE_TEMPLATE', templateId)
    state.templates = state.templates.filter(a => a.id != templateId)
  },
}

export const actions = {
  createTemplate: ({ commit }, template) => {
    console.log('action createTemplate', stringify(template))
    commit('ADD_TEMPLATE', template)
  },
  loadTemplates: ({ commit }) => {
    console.log('000_loadTemplates')
    template_api.getProjectTemplates()
    .then(data => {
      console.log(JSON.stringify(data))
      commit('SET_TEMPLATES', data)
    })
  },
  setCurrentTemplateById: ({ commit }, templateId) => {
    console.log('action setCurrentTemplateById' + templateId)
    return new Promise((resolve, reject) => {
      FirestoreApi.fetch('templates', false).then(templates => {
        let templatesArray = templates.filter(template => template.id == templateId)
        if (templatesArray && templatesArray.length > 0) {
          let currTemplate = templatesArray[0]
          console.log('currTemplate - ' + stringify(currTemplate))
          commit('SET_CURRENT_TEMPLATE', currTemplate)
          resolve(currTemplate)
        } else {
          reject()
        }
      })
    })
  },
  updateTemplate: ({ commit }, { templateId, updatedTemplate }) => {
    console.log('action updateTemplate', templateId)
    FirestoreApi.fetch('templates', true).then(templates => {
      let templateForUpdArray = templates.filter(template => template.data().id == templateId)
      if (templateForUpdArray && templateForUpdArray.length > 0) {
        let templateForUpd = templateForUpdArray[0]
        console.log('templateForUpd', templateForUpd.id, stringify(templateForUpd))
        FirestoreApi.updateDoc('templates', templateForUpd.id, updatedTemplate).then(() =>
          commit('UPDATE_TEMPLATE', {
            oldTemplateId: templateId,
            newTemplate: updatedTemplate
          }))
      }
    })
  },
  resetCurrentTemplate: ({ commit }) => {
    console.log('action resetCurrentTemplate')
    return new Promise(resolve => {
      commit('SET_CURRENT_TEMPLATE', null)
      resolve()
    })
  },
  deleteTemplate: ({ commit }, templateId) => {
    console.log('action deleteTemplate', templateId)
    template_api.deleteTemplate(templateId)
    .then(data => {
      console.log(JSON.stringify(data))
      commit('REMOVE_TEMPLATE', templateId)
    })
    // FirestoreApi.fetch('templates', true).then(templates => {
    //   let templateForDelArray = templates.filter(template => template.data().id == templateId)
    //   if (templateForDelArray && templateForDelArray.length > 0) {
    //     let templateForDel = templateForDelArray[0]
    //     console.log('templateForDel', templateForDel.id +
    //       ' ' + stringify(templateForDel))
    //     FirestoreApi.deleteDoc('templates', templateForDel.id)
    //       .then(() => commit('REMOVE_TEMPLATE', templateId))
    //   }
  }
}

export const getters = {
  getNewTemplateId: (state) => {
    if (state.templates == null || state.templates.length == 0) {
      return 0
    }
    let ids = state.templates.map(inst => inst.id)
    let newId = Math.max(...ids) + 1
    return newId
  }
}