import FirestoreApi from '../../api/firestore-api'
import { stringify } from 'querystring'

const getProjectTemplate = (key) => {
  FirestoreApi.fetch('project_templates', false, key)
    .then(res => {
      stringify(res)
    })
}

export default { getProjectTemplate }