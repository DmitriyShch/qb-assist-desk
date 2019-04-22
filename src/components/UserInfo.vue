<template>
  <div class="top-status-panel">
    <ul>
      <li>{{userInfo}}</li>
      <li>
        <button v-show="userIsLogged" @click="$store.dispatch('SIGN_OUT')">Sign Out</button>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  computed: mapGetters(["userInfo", "userIsLogged"])
};
</script>

<style>
.top-status-panel > ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  align-items: flex-end;
  text-align: right;
}

li {
  display: inline;
  padding: 10px;
}
</style>
