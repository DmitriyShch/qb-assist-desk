<template>
  <div>
    <button @click="$store.dispatch('SIGN_IN', () => $router.replace({ name: 'applications' }))">Sign In</button>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "SignUser",
  computed: mapGetters(["userIsLogged"]),
  watch: {
    userIsLogged(isLogged) {
      isLogged && this.$router.replace({ name: "main" })
    }
  }
}
</script>