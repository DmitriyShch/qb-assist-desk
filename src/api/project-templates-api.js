import FirestoreApi from './firestore-api'

const getProjectTemplate = (key) => {
  return FirestoreApi.fetchByDocId('project_templates', false, key)
}

export default { getProjectTemplate }