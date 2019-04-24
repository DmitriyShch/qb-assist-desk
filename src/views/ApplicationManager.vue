<template>
  <div id="applicationmanager">
    <h1>Application Manager = {{applicationId}}</h1>
    <div id="nav">
      <router-link :to="{ name: 'dashboard' }">Dashboard</router-link> |
      <router-link :to="{ name: 'structure' }">Structure</router-link> |
      <router-link :to="{ name: 'forms' }">Forms</router-link> |
      <router-link :to="{ name: 'applications' }">Return to Applications</router-link>
    </div>
    <router-view/>
    <router-view name="b"/>
  </div>
</template>

<script>
export default {
  props: {
    applicationId: {
      type: Number,
      required: true
    }
  },
  beforeMount() {
    console.log('beforeMount applicationId -', this.applicationId)
    this.$store.dispatch('application/setCurrentApplicationById', this.applicationId)
  }
}
</script>
<style>
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #ee299c;
}

#nav a.router-link-exact-active {
  color: #e9e9e9;
}
</style>
