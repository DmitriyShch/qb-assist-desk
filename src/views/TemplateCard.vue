<template>
  <form @submit.prevent="save">
    <div>
      <div class="template-create">
        <label for="id">Id</label>
        <input id="id" type="text" v-model="template.id" />
        <label for="url">File url</label>
        <input id="url" type="text" v-model="template.data.url" />
        <!--  <input id="name" type="text" v-model="template.name"> -->
        <div>
          <!-- <form action="http://localhost:3000/api/templates/files/upload" method="post" enctype="multipart/form-data"> -->
          <label for="url2">File url2</label>
          <input id="url2" name="url2" type="file" @change="onFileChange" />
          <!-- </form> -->
        </div>
        <label for="template">Details</label>
        <textarea
          name="template"
          id="template"
          cols="30"
          rows="10"
          v-model="template.data.template"
        ></textarea>
        <label for="template_files2">FILES</label>
        <textarea
          name="template_files2"
          id="template_files2"
          cols="30"
          rows="10"
          v-model="files_str"
        ></textarea>
        <label for="template_template">TEMPLATE</label>
        <textarea
          name="template_template"
          id="template_template"
          cols="30"
          rows="10"
          v-model="template_template"
        ></textarea>
        <!-- <div>
        <div style="border: dotted">
          <label for="fileName2">FileName2222</label>
          <input id="fileName2" name="fileName2" v-model="templateObj2.FileName"/>
        </div>
        <ul>
          <li v-for="tmplFile in filesObj.FILES" :key="tmplFile.FileName">
            <div style="border: solid; color: pink">
              <div style="border: dotted">
                <label for="fileName">FileName</label>
                <input id="fileName" name="fileName" v-model="tmplFile.FileName"/>
              </div>
              <div style="border: dotted">
                <label for="info">Info</label>
                <input id="info" name="info" v-model="tmplFile.Info"/>
              </div>
              <div style="border: dotted">
                <label for="name">Name</label>
                <input id="name" name="name" v-model="tmplFile.Name"/>
              </div>
              <a href="#" @click.prevent="editTemplate(tmplFile.FileName)">{{ tmplFile.Info }} ({{ tmplFile.Name }})</a>
              <button @click='deleteTemplate(tmplFile.FileName)'>Delete</button>
            </div>
          </li>
        </ul>
        </div>-->
        <button type="submit">{{ saveButtonText }}</button>
      </div>
    </div>

    <div id="demo">
      <form id="search">
        Search
        <input name="query" v-model="searchQuery" />
      </form>
      <DemoGrid
        :tableId="'fileGrid'"
        :keyColumn="'FileName'"
        :heroes="template.object.FILES"
        :columns="fileColumns"
        :filter-key="searchQuery"
        :markColumn="'Mark'"
      ></DemoGrid>
    </div>

    <table>
      <thead>
        <tr>
          <th v-for="key in this.fileColumns" v-bind:key="key">{{ key }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input id="Name" v-model="currFile.Name" />
          </td>
          <td>
            <input id="FileName" type="file" @change="onFileChange" />
          </td>
          <td>
            <input id="Storage" v-model="currFile.Storage" />
          </td>
          <td>
            <input id="Path" v-model="currFile.Path" />
          </td>
          <td>
            <input id="Info" v-model="currFile.Info" />
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button type="button" v-on:click="uploadFile">Upload</button>
      <button @click="addFileToTemplate" type="button">Add File</button>
      <button @click="removeFileFromTemplate" type="button">Remove File</button>
    </div>
  </form>
</template>

<script>
import { stringify } from 'querystring'
import utils from '../api/utils'
import yaml from 'yaml'
// import path2 from 'path';
import templates_api from '../api/project-templates-api'
// import config from '../../config/config';
import DemoGrid from '@/components/DemoGrid.vue'

// export default {
//   computed: mapGetters(["userInfo", "userIsLogged"])
// };

export default {
  components: {
    DemoGrid
  },
  props: {
    templateId: {
      type: String,
      required: false
    }
  },
  data() {
    let tmpTemplate = {
      data: {},
      object: {}
    }
    console.log('TemplateCard - data - templateId:', this.templateId)
    if (this.templateId != null) {
      this.$store
        .dispatch('template/setCurrentTemplateById', this.templateId)
        .then(template => {
          console.log('111_template:', template)
          template.isNew = false
          this.template = template
          this.originalTemplateId = template.id
          console.log('456', JSON.stringify(template))
        })
        .catch(err => {
          console.log(err)
          tmpTemplate = this.createNewTemplate()
          tmpTemplate.isNew = true
          this.template = tmpTemplate
        })
    } else {
      tmpTemplate = this.createNewTemplate()
      tmpTemplate.isNew = true
    }

    console.log('123123', JSON.stringify(tmpTemplate))

    return {
      template: tmpTemplate,
      originalTemplateId: tmpTemplate.id,
      gridColumns: ['name', 'power'],
      fileColumns: ['Name', 'FileName', 'Storage', 'Path', 'Info', 'Mark'],
      gridData: [
        { name: 'Chuck Norris22', power: Infinity },
        { name: 'Bruce Lee', power: 9000 },
        { name: 'Jackie Chan', power: 7000 },
        { name: 'Jet Li', power: 8000 }
      ],
      searchQuery: '',
      currFile: {},
      files_str: ''
    }
  },
  computed: {
    saveButtonText() {
      return this.template.isNew ? 'Create' : 'Update'
    },
    template_template() {
      return yaml.stringify(this.template.object['SCRIPT-TMPL'])
    }
  },
  watch: {
    template: {
      handler() {
        console.log('template.object.FILES Changed!')
        this.files_str = yaml.stringify(this.template.object.FILES)
      },
      deep: true
    }
  },
  methods: {
    createNewTemplate() {
      let objectId = utils.getNewGuid()
      let newid = this.$store.getters['template/getNewTemplateId']
      return {
        objectId: objectId,
        id: newid,
        name: 'template - ' + newid,
        forms: [{ id: 1, name: 'form1' }, { id: 2, name: 'form2' }]
      }
    },
    save() {
      console.log('save', stringify(this.template))
      if (this.template.isNew) {
        this.$store
          .dispatch('template/createTemplate', this.template)
          .then(this.$router.push('templates'))
      } else {
        this.$store
          .dispatch('template/updateTemplate', {
            templateId: this.originalTemplateId,
            updatedTemplate: this.template
          })
          .then(data => {
            console.log(data)
            this.$router.push('templates')
          })
      }
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      if (files.length) {
        console.log('file00 - ', files[0])
        //config.firebase_path_prefix +
        this.currFile.FileName = files[0].name
        console.log('this.currFile.FileName - ', this.currFile.FileName)
      }
    },
    uploadFile(e) {
      console.log(e)
      this.uploadFileImpl()
    },
    uploadFileImpl() {
      console.log('uploadFileImpl')
      return new Promise((resolve, reject) => {
        var files = document.getElementById('FileName').files
        if (files.length) {
          console.log('file00 - ', files[0])
          templates_api
            .uploadTemplateFile(files[0], this.template.id)
            .then(filePath => {
              templates_api
                .acceptTemplateFile(files[0].name, this.template.id)
                .then(() => {
                  console.log('filePath:', filePath)
                  let s1 = files[0].name
                  let shortName = s1.replace(/\..+$/, '')

                  // let shortName = files[0].name.replace(/\..+$/, '')(files[0].name)
                  console.log('shortName:', shortName)
                  this.$set(this.currFile, 'Name', shortName)
                  this.$set(this.currFile, 'FileName', files[0].name)
                  this.$set(this.currFile, 'Path', filePath)
                  this.$set(this.currFile, 'Storage', 'firebase-storage')

                  // this.currFile.Path = filePath
                  console.log('currFile:', this.currFile)
                  resolve('uploadFileImpl successful')
                })
                .catch(err => reject(err))
            })
        }
      })
    },
    addFileToTemplateImpl() {
      console.log('addFileToTemplateImpl')
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('template/addFileToCurrentTemplate', this.currFile)
          .then(() => {
            console.log('template.object.FILES', this.template.object.FILES)
            resolve('addFileToTemplateImpl successful')
          })
          .catch(err => reject(err))
        this.currFile = {}
      })
    },

    addFileToTemplate() {
      console.log('this.currFile - ', this.currFile)
      return new Promise((resolve, reject) => {
        if (this.currFile.Name) {
          return this.addFileToTemplateImpl().then(() => {
            this.currFile = {}
            resolve('addFileToTemplateImpl successful')
          })
        } else {
          this.uploadFileImpl()
            .then(() => {
              this.addFileToTemplateImpl().then(() => {
                this.currFile = {}
                resolve('addFileToTemplateImpl successful')
              })
            })
            .catch(err => reject(err))
        }
      })
    },
    removeFileFromTemplate() {
      console.log('this.currFile - ', this.currFile)
      console.log(this.$children)
      console.log(this.$children[0].selectedRows)
      let selRows = this.$children[0].selectedRows
      for (let sr in selRows) {
        console.log(selRows[sr])
        this.$store
          .dispatch('template/removeFileFromCurrentTemplate', selRows[sr])
          .then(() => {
            console.log('template.object.FILES', this.template.object.FILES)
          })
      }
      // var table = document.getElementById('mytab1')
      // for (var i = 0, row; (row = table.rows[i]); i++) {
      //   //iterate through rows
      //   //rows would be accessed using the "row" variable assigned in the for loop
      //   for (var j = 0, col; (col = row.cells[j]); j++) {
      //     //iterate through columns
      //     //columns would be accessed using the "col" variable assigned in the for loop
      //   }
      // }
      // this.$store
      //   .dispatch('template/addFileToCurrentTemplate', this.currFile)
      //   .then(() => {
      //     console.log('template.object.FILES', this.template.object.FILES)
      //   })
      this.currFile = {}
    }
  }
}
</script>
