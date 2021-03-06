import FirestoreApi from './firestore-api'
import http from './qb-query-server-api'
import store from '../store/store'
import fbStorage from './fb-storage';

const getProjectTemplate = (key) => {
  return FirestoreApi.fetchByDocId('project_templates', false, key)
}

const getProjectTemplates = () => {
  console.log('1111_getProjectTemplates')
  return new Promise((resolve, reject) => {
    http.get('api/templates', getAuthConfig())
    .then(resp => {
      resolve(resp.data)
    })
    .catch(err => reject(err))
  })
}

const createTemplate = (template) => {
  console.log('createTemplate', JSON.stringify(template))
  const data = {
    "url": "457gs://qb-assist-desk.appspot.com/proj-vue-simple100.zip",
    "template": "FILES:\n- Name: proj-vue-simple1\n  FileName: proj-vue-simple1.zip\n  Storage: firebase-storage\n  Path: gs://qb-assist-desk.appspot.com/proj-vue-simple1.zip\n  Info: Archive with simple vue.js project\n\nSCRIPT-TMPL:\n- Text: \"\n    ROOT_DIR=$pwd\n\n    SRC_ARCH_FILE_UNZIPPED=proj-vue-simple1\n    SRC_ARCH_FILE=$SRC_ARCH_FILE_UNZIPPED.zip\n    SRC_FILE_LINK={{file:proj-vue-simple1}}\n\n    rm -rf $SRC_ARCH_FILE_UNZIPPED\n    rm $SRC_ARCH_FILE\n\n    wget $SRC_FILE_LINK -O $SRC_ARCH_FILE\n\n    unzip $SRC_ARCH_FILE -d $SRC_ARCH_FILE_UNZIPPED\n\n    cd $SRC_ARCH_FILE_UNZIPPED/$SRC_ARCH_FILE_UNZIPPED\n    npm i\n\n    cd $ROOT_DIR\n    \""
  }
  return new Promise((resolve, reject) => {
   http.put(`api/templates/${template.id}`, data, getAuthConfig())
    .then(resolve('CREATED SUCCESSFUL'))
    .catch(err => reject(err))
  })
}

const updateTemplate = (template) => {
  console.log('updateTemplate', JSON.stringify(template))
  const data = template.data
  // const data = {
  //   "url": template.data.url,
  //   "intent": template.data.intent,
  //   "template": template.data.template
  // }
  return new Promise((resolve, reject) => {
   http.post(`api/templates/${template.id}`, data, getAuthConfig())
    .then(resolve('UPDATED SUCCESSFUL'))
    .catch(err => reject(err))
  })
}

const deleteTemplate = (id) => {
  console.log('deleteTemplate', id)
  return new Promise((resolve, reject) => {
   http.delete(`api/templates/${id}`, getAuthConfig())
    .then(resolve('DELETED SUCCESSFUL'))
    .catch(err => reject(err))
  })
}

const getTemplateFileUploadToken = () => {
  console.log('getTemplateFileUploadToken')
  return new Promise((resolve, reject) => {
    http.get('api/templates/files/upload/token', getAuthConfig())
    .then(resp => {
      resolve(resp.data)
    })
    .catch(err => reject(err))
  })
}

const uploadTemplateFile = (file, templateId) => {
  console.log('uploadTemplateFile', file.name)
  return new Promise((resolve, reject) => {
    getTemplateFileUploadToken()
      .then(ctoken => {
        fbStorage.uploadTmpFile(file, ctoken, templateId)
          .then((data) => {
            console.log('fbStorage.uploadTmpFile completed')
            resolve(data)
          })
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
    })
}

const acceptTemplateFile = (fileName, templateId) => {
  console.log('acceptTemplateFile', fileName)
  return new Promise((resolve, reject) => {
    const data = {
      file_name: fileName,
      subfolder: templateId
    }
    http.post('api/templates/files/upload/acceptfile', data, getAuthConfig())
    .then(resp => {
      console.log('resp.data:', resp.data)
      resolve(resp.data)
    })
    .catch(err => reject(err))
  })
}

function getAuthConfig() {
  const config = {
    headers: {
      Authorization: `Bearer ${store.state.user.idToken}`,
    }
  }
  return config
} 

export default { getProjectTemplate, getProjectTemplates, createTemplate,
  updateTemplate, deleteTemplate, uploadTemplateFile, acceptTemplateFile }