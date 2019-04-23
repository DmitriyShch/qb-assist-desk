<template>
  <form @submit.prevent="save">
    <div class="formcard">
      <label for="id">Id</label>
      <input id="id" type="text" v-model="form.id">
      <label for="name">Name</label>
      <input id="name" type="text" v-model="form.name">
      <button type="submit">{{saveButtonText}}</button>
    </div>
  </form>
</template>

<script>
import utils from '../api/utils'

export default {
  props: {
    formId: {
      type: String,
      required: false
    },
  },
  data() {
    console.log('formId -', this.formId)
    let tmpForm = {}
    if (this.formId != null) {
      this.$store.dispatch('form/getFormById', this.formId)
        .then((form) => {
          tmpForm = form
          tmpForm.isNew = false
          this.form = tmpForm
        })
        .catch((err) => {
          console.log(err)
          let { id, hash }= utils.getNewGuidWithHash()
          tmpForm = { id: id, name: 'Form -' + hash, isNew: true }
          this.form = tmpForm
        })
    } else {
      let { id, hash }= utils.getNewGuidWithHash()
      tmpForm = { id: id, name: 'Form -' + hash, isNew: true }
    }
    return {
      form: tmpForm,
      oldFormId: tmpForm.id
    };
  },
  computed: {
    saveButtonText() {
      return this.form.isNew ? 'Create' : 'Update'
    }
  },
  methods: {
    save() {
      if (this.form.isNew) {
        this.$store.dispatch('form/addForm', this.form)
          .then(this.$router.push({ name: 'forms' }))
      } else {
        this.$store.dispatch('form/updateForm', {
            oldFormId: this.oldFormId,
            form: this.form
          })
          .then(this.$router.push({ name: 'forms' }))
      }
    }
  }
}
</script>
