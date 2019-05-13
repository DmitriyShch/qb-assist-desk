import yaml from 'yaml'
import { stringify } from 'querystring';
import ProjectTemplatesApi from './project-templates-api'

const parse = (textStruct) => {
  console.log('parse:', textStruct)
  if (!textStruct || textStruct == "") {
    return ''
  }
  let doc = yaml.parse(textStruct)
  console.log(doc)
  console.log(stringify(doc))
  return doc
}

const extParse = (textStruct) => {
  console.log('extParse:', textStruct)
  let doc = parse(textStruct)
  let resText = ""
  let step = 1

  if (!doc || !doc.app) {
    return ''
  }
  
  if (doc.app.type) {
    resText += step++ + '. Create new ' + doc.app.type
    if (doc.app.front && doc.app.front.framework) {
      resText += ' (' + doc.app.front.framework + ')\n'
    }
  }
  if (doc.app.auth) {
    resText += step++ + '. Add login form and set router to logined user. Auth: ' + doc.app.auth
    if (doc.app.auth_prov) {
      resText += ' (' + doc.app.auth_prov + ')\n'
    }
  }
  if (resText != '') {
    resText += step++ + '. Download app to local.'
  }
  console.log(resText)
  return resText
}

const getProjectTemplateName = (textStruct) => {
  console.log('getProjectTemplateName:', textStruct)
  let result = null
  let doc = parse(textStruct)
  if (doc.app.front.framework == 'vuejs') {
    if (doc.app.auth_prov == 'google') {
      result = 'proj2-with-auth'
    } else {
      result = 'vue-simple-proj1'
    }
  }
  return result
}

const getProjectTemplateUrl = (textStruct) => {
  console.log('getProjectTemplate:', textStruct)
  return new Promise((resolve, reject) => {
  
  let templateName = getProjectTemplateName(textStruct)

  console.log('templateName', templateName)

  if (templateName == null) {
    return reject('No such template')
  }
  
  let projTmplPromise = ProjectTemplatesApi.getProjectTemplate(templateName)

  console.log('projTmplPromise', projTmplPromise)

  projTmplPromise
    .then(res => {
      console.log('projTmplPromise then', res)
      resolve(res[0].url)
    })
    .catch(err => reject(err))
  })
}

export default { parse, extParse, getProjectTemplateName, getProjectTemplateUrl }