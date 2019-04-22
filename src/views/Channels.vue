<template>
  <div class="Channels">
    <h1>Channels of Instance ({{instance.id}})</h1>
    <button @click='$router.push({ name: "newChannelCard" })'><h1>Create Channel</h1></button>
    <ul>
      <li v-for="channel in instance.channels" :key="channel.id">
        <div>
          <router-link :to="{ name: 'channelCard',
            params: { channelId: channel.id } }">{{ channel.name }} ({{ channel.id }})
          </router-link>
          <button @click='$store.dispatch("channel/deleteChannel", channel.id)'>Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    instance() {
      return this.$store.state.instance.currentInstance
    }
  }
}
</script>

