import { stringify } from "querystring";
import FirestoreApi from '../../api/firestore-api'

export const namespaced = true

export const mutations = {
  ADD_FORM: (state, { application, form }) => {
    console.log('mutation ADD_FORM -', stringify(form))
    if (application.forms == null) {
      application.forms = [form]
    } else {
      application.forms.push(form)
    }
  },
  UPDATE_FORM: (state, { application, oldFormId, form }) => {
    console.log('mutation UPDATE_FORM - oldFormId',
      oldFormId, 'form', stringify(form))
    if (application.forms == null) {
      console.error('application.forms is null, application: ',
        stringify(form), ', oldFormId:', oldFormId)
    } else {
      const forms = application.forms.filter(ch => ch.id == oldFormId)
      if (forms && forms.length > 0) {
        const oldForm = forms[0]
        oldForm.id = form.id
        oldForm.name = form.name
      }
    }
  },
  REMOVE_FORM: (state, { application, formId }) => {
    console.log('mutation REMOVE_FORM - ' + formId)
    application.forms = application.forms.filter(ch => ch.id != formId)
  },
  SET_CURRENT_FORM: (state, form) => {
    console.log('mutation SET_FORM - form -' + stringify(form))
    state.currentForm = form
  }
}

export const actions = {
  addForm: ({ commit, rootState }, form) => {
    const application = rootState.application.currentApplication
    console.log('action addForm', stringify(form), stringify(application))
    commit('ADD_FORM', { application, form })
    FirestoreApi.saveApplication(application)
  },
  updateForm: ({ commit, rootState }, { oldFormId, form }) => {
    const application = rootState.application.currentApplication
    console.log('action updateForm', oldFormId, form, stringify(application))
    commit('UPDATE_FORM', { application, oldFormId, form })
    FirestoreApi.saveApplication(application)
  },
  deleteForm: ({ commit, rootState }, formId) => {
    const application = rootState.application.currentApplication
    console.log('action deleteForm - ' + formId)
    commit('REMOVE_FORM', { application, formId })
    FirestoreApi.saveApplication(application)
  },
  getFormById({ rootState }, formId) {
    const application = rootState.application.currentApplication
    console.log('action getFormById - ' + formId)
    return new Promise((resolve, reject) => {
      const forms = application.forms.filter(ch => ch.id == formId)
      if (forms && forms.length > 0) {
        resolve(forms[0])
      } else {
        reject()
      }
    })
  }
}