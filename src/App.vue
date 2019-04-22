<template>
  <div id="app">
    <div id="nav">
      <UserInfo />
      <h1>Hello</h1>
    </div>
    <router-view />
    <router-view name='b' />
  </div>
</template>
<script>
import UserInfo from "./components/UserInfo.vue";

export default {
  components: {
    UserInfo
  },
  mounted() {
    this.$store.dispatch('checkLogin', {
       callbackSignOut: () => this.$router.replace({ path: "/login" })
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
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
