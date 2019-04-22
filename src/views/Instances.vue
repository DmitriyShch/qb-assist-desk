<template>
  <div class="instances">
    <h1>Hyperledger Instances</h1>
    <button @click='onAddInstanceClick'><h1>Create Instance</h1></button>
    <ul>
      <li v-for="instance in instances" :key="instance.id">
        <div>
          <a href="#" @click.prevent="editInstance(instance.id)">{{ instance.name }} ({{ instance.id }})</a>
          <button @click='deleteInstance(instance.id)'>Delete</button>
          <router-link :to="{ name: 'instanceManager', params: { instanceId: instance.id } }">Manage</router-link>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  computed: {
    instances() {
      return this.$store.state.instance.instances
    }
  },
  methods: {
    onAddInstanceClick() {
      this.$router.push('instanceCard')
    },
    deleteInstance(id) {
      console.log('Try delete instance ' + id)
      this.$store.dispatch('instance/deleteInstance', id)
    },
    editInstance(id) {
      console.log('editInstance ' + id)
      this.$router.push({ name: 'instanceCard', params: { instanceId: id } })
    },
  },
  beforeMount() {
    if (this.$root._isMounted) {
      this.$store.dispatch('instance/loadInstances')
    }
  }
}
</script>

