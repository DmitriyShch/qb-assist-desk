<template>
  <div class="Forms">
    <h1>Forms of Application ({{application.id}})</h1>
    <button @click='$router.push({ name: "newFormCard" })'><h1>Create Form</h1></button>
    <ul>
      <li v-for="form in application.forms" :key="form.id">
        <div>
          <router-link :to="{ name: 'formCard',
            params: { formId: form.id } }">{{ form.name }} ({{ form.id }})
          </router-link>
          <button @click='$store.dispatch("form/deleteForm", form.id)'>Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  computed: {
    application() {
      return this.$store.state.application.currentApplication
    }
  }
}
</script>

