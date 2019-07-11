<template>
  <div class="Templates">
    <h1>Program Templates</h1>
    <button @click='onAddTemplateClick'><h1>Create Template</h1></button>
    <ul>
      <li v-for="Template in Templates" :key="Template.id">
        <div>
          <a href="#" @click.prevent="editTemplate(Template.id)">{{ Template.name }} ({{ Template.id }})</a>
          <button @click='deleteTemplate(Template.id)'>Delete</button>
          <router-link :to="{ name: 'TemplateManager', params: { TemplateId: Template.id } }">Manage</router-link>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  computed: {
    Templates() {
      return this.$store.state.Template.Templates
    }
  },
  methods: {
    onAddTemplateClick() {
      this.$router.push('TemplateCard')
    },
    deleteTemplate(id) {
      console.log('Try delete Template ' + id)
      this.$store.dispatch('Template/deleteTemplate', id)
    },
    editTemplate(id) {
      console.log('editTemplate ' + id)
      this.$router.push({ name: 'TemplateCard', params: { TemplateId: id } })
    },
  },
  beforeMount() {
    if (this.$root._isMounted) {
      console.log('beforeMount loadTemplates')
      this.$store.dispatch('template/loadTemplates')
    }
  }
}
</script>

