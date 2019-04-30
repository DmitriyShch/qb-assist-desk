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
      <button type="button" @click="download">Download</button>
      <button type="button" @click="downloadLocal">Download to local</button>
    </div>
  </form>
</template>

<script>
import { stringify } from 'querystring'
import StructParser from '../api/struct-parser'
import FbStorage from '../api/fb-storage'

export default {
  data() {
    return {
      parsedStruct: '',
      urlgs: 'gs://qb-assist-desk.appspot.com/proj-vue-simple1.zip'
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
      console.log('method download')
      FbStorage.getStorageLink(this.urlgs)
        .then(url => {
          console.log('final url', url)
          var xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = () => {
            var data = xhr.response;
            const url = window.URL.createObjectURL(new Blob([data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'file.zip')
            document.body.appendChild(link)
            link.click()
          };
          xhr.open('GET', url);
          xhr.send();
        })
    },
  }
}
</script>
