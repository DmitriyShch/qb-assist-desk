<template>
    <div id="main">
        <div id="nav">
            <router-link to="/main/instances">Instances</router-link> |
            <router-link to="/main/settings">Settings</router-link>
        </div>
        <router-view />
        <router-view name="b"/>
    </div>
</template>

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
