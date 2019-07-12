import FirestoreApi from './firestore-api'
import http from './qb-query-server-api'
import store from '../store/store'

const getProjectTemplate = (key) => {
  return FirestoreApi.fetchByDocId('project_templates', false, key)
}

const getProjectTemplates = () => {
  // console.log('store.state.idToken000_', store.state.idToken)
  // console.log('store.state.idToken111_', store.state.user.idToken)
  const config = {
    headers: {
      Authorization: `Bearer ${store.state.user.idToken}`,
    }
  }
  console.log('1111_getProjectTemplates')
  return new Promise((resolve, reject) => {
  // http.get('http://localhost:3000/api/templates?token=12341234')
   http.get('api/templates', config)
    .then(resp => {
      resolve(resp.data)
    })
    .catch(err => reject(err))
  })
  // return FirestoreApi.fetchByDocId('project_templates', false, key)
}

const deleteTemplate = (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${store.state.user.idToken}`,
    }
  }
  console.log('deleteTemplate', id)
  return new Promise((resolve, reject) => {
   http.delete(`api/templates/${id}`, config)
    .then(resolve('DELETED SUCCESSFUL'))
    .catch(err => reject(err))
  })
}

export default { getProjectTemplate, getProjectTemplates, deleteTemplate }