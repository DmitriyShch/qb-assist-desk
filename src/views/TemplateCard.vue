<template>
  <form @submit.prevent="save">
    <div>
    <div class="template-create">
      <label for="id">Id</label>
      <input id="id" type="text" v-model="template.id">
      <label for="url">File url</label>
      <input id="url" type="text" v-model="template.data.url">
      <label for="template">Details</label>
      <!--  <input id="name" type="text" v-model="template.name"> -->
      <div>
        <!-- <form action="http://localhost:3000/api/templates/files/upload" method="post" enctype="multipart/form-data"> -->
          <label for="url2">File url2</label>
          <input id="url2" name="url2" type="file" @change="onFileChange" />
          <button type="button" v-on:click="uploadFile">Upload</button>
        <!-- </form> -->
      </div>
      <textarea name="template" id="template" cols="30" rows="10"
        v-model="template.data.template"></textarea>
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
      </div> -->
      <button type="submit">{{saveButtonText}}</button>
    </div>
    </div>

    <div id="demo">
      <form id="search">
        Search <input name="query" v-model="searchQuery">
      </form>
      <DemoGrid
        :heroes="filesObj.FILES"
        :columns="fileColumns"
        :filter-key="searchQuery">
      </DemoGrid>
    </div>

    <table>
      <thead>
        <tr>
          <th v-for="key in this.fileColumns"
            v-bind:key="key">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input id='Name' v-model="currFile.Name" />
          </td>
          <td>
            <input id='FileName' type='file' @change="onFileChange" />
          </td>
          <td>
            <input id='Storage' v-model="currFile.Storage" />
          </td>
          <td>
            <input id='Path' v-model="currFile.Path" />
          </td>
          <td>
            <input id='Info' v-model="currFile.Info" />
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <button @click="addFileToTemplate" type="button">Add File</button>
    </div>

  </form>
</template>

<script>
import { stringify } from 'querystring';
import utils from '../api/utils';
import yaml from 'yaml';
import templates_api from '../api/project-templates-api';
import config from '../../config/config';
import DemoGrid from "@/components/DemoGrid.vue"

export default {
  components: {
    DemoGrid
  },
  props: {
    templateId: {
      type: String,
      required: false
    },
  },
  data() {
    let tmpTemplate = {
      data: {}
    }
    console.log('TemplateCard - data - templateId:', this.templateId)
    if (this.templateId != null) {
      this.$store.dispatch('template/setCurrentTemplateById', this.templateId)
        .then((template) => {
          template.isNew = false
          this.template = template
          this.originalTemplateId = template.id
          this.filesObj = yaml.parse(template.data.template)
          console.log('456', JSON.stringify(template))
        })
        .catch((err) => {
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
      filesObj: {},
      gridColumns: ['name', 'power'],
      fileColumns: ['Name', 'FileName', 'Storage', 'Path', 'Info'],
      gridData: [
        { name: 'Chuck Norris22', power: Infinity },
        { name: 'Bruce Lee', power: 9000 },
        { name: 'Jackie Chan', power: 7000 },
        { name: 'Jet Li', power: 8000 }
      ],
      searchQuery: '',
      currFile: {}
    };
  },
  computed: {
    saveButtonText() {
      return this.template.isNew ? 'Create' : 'Update'
    },
    templateObj() {
      return yaml.parse(this.template.data.template)
    },
  },
  watch: {
    // 'templateObj.FILES.FileName': {
    //   handler(val){
    //     console.log('templateObj Changed!', val);
    //   },
    //   deep: true
    // },
    'filesObj.FILES': {
      // handler(newVal, oldVal){
      handler(){
        console.log('templateObj Changed!');
        // console.log('templateObj Changed!', JSON.stringify(newVal), JSON.stringify(oldVal));
      },
      deep: true
    },
    // 'filesObj.FILES': function (newVal, oldVal){
    //     console.log('filesObj.FILES Changed!', newVal, oldVal);
    // }
  },
  methods: {
    createNewTemplate() {
      let objectId = utils.getNewGuid()
      let newid = this.$store.getters['template/getNewTemplateId']
      return {
        objectId: objectId,
        id: newid,
        name: "template - " + newid,
        forms: [
          {id: 1, name: 'form1'},
          {id: 2, name: 'form2'},
        ]
      };
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
          .then(this.$router.push('templates'))
      }
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (files.length) {
        console.log('file00 - ', files[0])
        //config.firebase_path_prefix + 
        this.currFile.FileName = files[0].name
        console.log('this.currFile.FileName - ', this.currFile.FileName)        
      }
    },
    uploadFile(e) {
      console.log(e)
      var files = document.getElementById('url2').files;
      if (files.length) {
        console.log('file00 - ', files[0])
        templates_api.uploadTemplateFile(files[0])
        .then(() => {
          templates_api.acceptTemplateFile(files[0].name)
        })
      }
    },
    addFileToTemplate() {
      console.log('this.currFile - ', this.currFile)  
      this.filesObj.FILES.push(this.currFile)
    }
  }
};
</script>
