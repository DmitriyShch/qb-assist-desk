<template>
  <div id="instancemanager">
    <h1>Instance Manager = {{instanceId}}</h1>
    <div id="nav">
      <router-link :to="{ name: 'dashboard' }">Dashboard</router-link> |
      <router-link :to="{ name: 'nodes' }">Nodes</router-link> |
      <router-link :to="{ name: 'channels' }">Channels</router-link> |
      <router-link :to="{ name: 'instances' }">Return to Instances</router-link>
    </div>
    <router-view/>
    <router-view name="b"/>
  </div>
</template>

<script>
export default {
  props: {
    instanceId: {
      type: Number,
      required: true
    }
  },
  beforeMount() {
    console.log('beforeMount instanceId -', this.instanceId)
    this.$store.dispatch('instance/setCurrentInstanceById', this.instanceId)
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
