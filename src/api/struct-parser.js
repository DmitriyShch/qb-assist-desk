import yaml from 'yaml'
import {
  stringify
} from 'querystring';

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
  if (!doc || !doc.app) {
    return ''
  }
  if (doc.app.type) {
    resText += '1. ' + doc.app.type
    if (doc.app.front && doc.app.front.framework) {
      resText += ' (' + doc.app.front.framework + ')\n'
    }
  }
  if (doc.app.auth) {
    resText += '2. auth: ' + doc.app.auth
    if (doc.app.auth_prov) {
      resText += ' (' + doc.app.auth_prov + ')\n'
    }
  }
  console.log(resText)
  return resText
}

export default { parse, extParse }