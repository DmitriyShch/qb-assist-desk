<template>
  <div class="applications">
    <h1>Hyperledger Applications</h1>
    <button @click='onAddApplicationClick'><h1>Create Application</h1></button>
    <ul>
      <li v-for="application in applications" :key="application.id">
        <div>
          <a href="#" @click.prevent="editApplication(application.id)">{{ application.name }} ({{ application.id }})</a>
          <button @click='deleteApplication(application.id)'>Delete</button>
          <router-link :to="{ name: 'applicationManager', params: { applicationId: application.id } }">Manage</router-link>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  computed: {
    applications() {
      return this.$store.state.application.applications
    }
  },
  methods: {
    onAddApplicationClick() {
      this.$router.push('applicationCard')
    },
    deleteApplication(id) {
      console.log('Try delete application ' + id)
      this.$store.dispatch('application/deleteApplication', id)
    },
    editApplication(id) {
      console.log('editApplication ' + id)
      this.$router.push({ name: 'applicationCard', params: { applicationId: id } })
    },
  },
  beforeMount() {
    if (this.$root._isMounted) {
      this.$store.dispatch('application/loadApplications')
    }
  }
}
</script>

