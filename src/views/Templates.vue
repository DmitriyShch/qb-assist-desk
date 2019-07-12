<template>
  <div class="Templates">
    <h1>Program Templates</h1>
    <button @click='onAddTemplateClick'><h1>Create Template</h1></button>
    <ul>
      <li v-for="template in templates" :key="template.id">
        <div>
          <a href="#" @click.prevent="editTemplate(Template.id)">{{ template.name }} ({{ template.id }})</a>
          <button @click='deleteTemplate(template.id)'>Delete</button>
          <router-link :to="{ name: 'TemplateManager', params: { templateId: template.id } }">Manage</router-link>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  computed: {
    templates() {
      return this.$store.state.template.templates
    }
  },
  methods: {
    onAddTemplateClick() {
      this.$router.push('TemplateCard')
    },
    deleteTemplate(id) {
      console.log('Try delete Template ' + id)
      this.$store.dispatch('template/deleteTemplate', id)
    },
    editTemplate(id) {
      console.log('editTemplate ' + id)
      this.$router.push({ name: 'TemplateCard', params: { templateId: id } })
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

