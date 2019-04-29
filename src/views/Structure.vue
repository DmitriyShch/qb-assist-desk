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
    </div>
  </form>
</template>

<script>
import { stringify } from 'querystring'
import StructParser from '../api/struct-parser'
import axios from 'axios'
import FbStorage from '../api/fb-storage'
import Cors from 'cors'

// const cors = new Cors({ origin: true })
// import HttpServer from  '../api/http-server'

export default {
  data() {
    return {
      parsedStruct: '',
      url0:'https://avatars.mds.yandex.net/get-pdb/34158/455616f7-e715-4675-aa33-0bef2343d6e3/s1200',
      url1: 'https://firebasestorage.googleapis.com/v0/b/qb-assist-desk.appspot.com/o/proj-vue-simple1.zip',
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
          console.log('cors', Cors({ origin: true }))
          axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
          axios.get(url, 
          { headers: {
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
            'Origin': '*',
            'Access-Control-Request-Method': ['POST', 'GET','PUT','DELETE','PATCH','OPTIONS'],
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Request-Headers': '*',
            'Access-Control-Max-Age': 3600,                 // Cache (seconds)
            'Access-Control-Expose-Headers': '*',
            'Access-Control-Allow-Origin': '*'


            // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            } })
            // responseType: 'arraybuffer',
            // headers: {
            //   "Access-Control-Allow-Origin": "*",
            //   "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            // }
          // })
          // axios({
          //   method: 'get',
          //   url: url,
          //   responseType: 'arraybuffer',
          //   // headers: {
          //   //   "Access-Control-Allow-Origin": "*",
          //   //   "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
          //   // }
          // })

          // .then(response => this.forceFileDownload3(response))
          // .catch(err => console.log(err))
        })
    },
    forceFileDownload(response) {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'file.png')
      document.body.appendChild(link)
      link.click()
    },
    forceFileDownload3(response) {
      // response.header("Access-Control-Allow-Origin", "*");
      // response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      // response.header("Access-Control-Allow-Origin", "*");
      // response.header("Access-Control-Allow-Headers", "{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'file.zip')
      document.body.appendChild(link)
      link.click()
    },
    // forceFileDownload2(response) {
    //   const url = window.URL.createObjectURL(new Blob([response.data]))
    //   const link = document.createElement('a')
    //   getStorageLink(this.url1)
    //     .then(url => {
    //       console.log('final url', url)
    //       link.href = url
    //       link.setAttribute('download', 'file.zip')
    //       document.body.appendChild(link)
    //       link.click()
    //     })
    // }
  }
}
</script>
