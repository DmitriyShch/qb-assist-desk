import yaml from 'yaml'
import { stringify } from 'querystring';

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

export default { parse, extParse }