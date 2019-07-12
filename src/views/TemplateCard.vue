<template>
  <form @submit.prevent="save">
    <div class="template-create">
      <label for="id">Id</label>
      <input id="id" type="text" v-model="template.id">
      <label for="name">Name</label>
      <input id="name" type="text" v-model="template.name">
      <button type="submit">{{saveButtonText}}</button>
    </div>
  </form>
</template>

<script>
import { stringify } from 'querystring';
import utils from '../api/utils';

export default {
  props: {
    templateId: {
      type: String,
      required: false
    },
  },
  data() {
    let tmpTemplate = {}
    console.log('TemplateCard - data - templateId:', this.templateId)
    if (this.templateId != null) {
      this.$store.dispatch('template/setCurrentTemplateById', this.templateId)
        .then((template) => {
          template.isNew = false
          this.template = template
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
    }
  }
};
</script>
