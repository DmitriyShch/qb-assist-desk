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
      <button type="submit">{{saveButtonText}}</button>
    </div>
    </div>
  </form>
</template>

<script>
import { stringify } from 'querystring';
import utils from '../api/utils';
import templates_api from '../api/project-templates-api';
import config from '../../config/config';

export default {
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
      originalTemplateId: tmpTemplate.id
    };
  },
  computed: {
    saveButtonText() {
      return this.template.isNew ? 'Create' : 'Update'
    }
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
        console.log('file0 - ', files[0])
        this.template.data.url = config.firebase_path_prefix + files[0].name
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
    }
  }
};
</script>
