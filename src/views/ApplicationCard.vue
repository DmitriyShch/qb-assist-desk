<template>
  <form @submit.prevent="save">
    <div class="application-create">
      <label for="id">Id</label>
      <input id="id" type="text" v-model="application.id">
      <label for="name">Name</label>
      <input id="name" type="text" v-model="application.name">
      <button type="submit">{{saveButtonText}}</button>
    </div>
  </form>
</template>

<script>
import { stringify } from 'querystring';
import utils from '../api/utils';

export default {
  props: {
    applicationId: {
      type: String,
      required: false
    },
  },
  data() {
    let tmpApplication = {}
    console.log('ApplicationCard - data - applicationId:', this.applicationId)
    if (this.applicationId != null) {
      this.$store.dispatch('application/setCurrentApplicationById', this.applicationId)
        .then((application) => {
          application.isNew = false
          this.application = application
        })
        .catch((err) => {
          console.log(err)
          tmpApplication = this.createNewApplication()
          tmpApplication.isNew = true
          this.application = tmpApplication
        })
    } else {
      tmpApplication = this.createNewApplication()
      tmpApplication.isNew = true
    }

    return {
      application: tmpApplication,
      originalApplicationId: tmpApplication.id
    };
  },
  computed: {
    saveButtonText() {
      return this.application.isNew ? 'Create' : 'Update'
    }
  },
  methods: {
    createNewApplication() {
      let objectId = utils.getNewGuid()
      let newid = this.$store.getters['application/getNewApplicationId']
      return {
        objectId: objectId,
        id: newid,
        name: "application - " + newid,
        forms: [
          {id: 1, name: 'form1'},
          {id: 2, name: 'form2'},
        ]
      };
    },
    save() {
      console.log('save', stringify(this.application))
      if (this.application.isNew) {
        this.$store
          .dispatch('application/createApplication', this.application)
          .then(this.$router.push('applications'))
      } else {
        this.$store
          .dispatch('application/updateApplication', {
            applicationId: this.originalApplicationId,
            updatedApplication: this.application
          })
          .then(this.$router.push('applications'))
      }
    }
  }
};
</script>
