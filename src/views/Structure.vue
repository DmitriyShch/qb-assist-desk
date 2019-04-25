<template>
  <form @submit.prevent="save">
    <div class="Structure">
      <h1>Structure</h1>
      <label for="structdetails" style="padding: 10px;">Structure details:</label>
      <textarea name="structdetails" id="structdetails" cols="30" rows="10"
        v-model="application.structure"></textarea>
      <textarea name="parsedstruct" id="parsedstruct" cols="30" rows="10"
        v-model="parsedStruct"></textarea>
      <button type="submit">Save</button>
       <button @click="download">Download</button>
    </div>
  </form>
</template>

<script>
import { stringify } from 'querystring';
import StructParser from '../api/struct-parser';
import HttpServer from  '../api/http-server'

export default {
  data() {
    return {
      parsedStruct: ''
    }
  },
  computed: {
    application() {
      return this.$store.state.application.currentApplication
    }
  },
  methods: {
      save() {
    console.log('save', stringify(this.application))
    this.$store
      .dispatch('application/updateApplication', {
        applicationId: this.application.id,
        updatedApplication: this.application
      })
      .then(this.parsedStruct = StructParser.extParse(this.application.structure))
    },
     download() {
       HttpServer.responseFile()
     }
  }
}
</script>
