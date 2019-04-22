<template>
  <form @submit.prevent="save">
    <div class="channelcard">
      <label for="id">Id</label>
      <input id="id" type="text" v-model="channel.id">
      <label for="name">Name</label>
      <input id="name" type="text" v-model="channel.name">
      <button type="submit">{{saveButtonText}}</button>
    </div>
  </form>
</template>

<script>
import utils from '../api/utils'

export default {
  props: {
    channelId: {
      type: String,
      required: false
    },
  },
  data() {
    console.log('channelId -', this.channelId)
    let tmpChannel = {}
    if (this.channelId != null) {
      this.$store.dispatch('channel/getChannelById', this.channelId)
        .then((channel) => {
          tmpChannel = channel
          tmpChannel.isNew = false
          this.channel = tmpChannel
        })
        .catch((err) => {
          console.log(err)
          let { id, hash }= utils.getNewGuidWithHash()
          tmpChannel = { id: id, name: 'Channel -' + hash, isNew: true }
          this.channel = tmpChannel
        })
    } else {
      let { id, hash }= utils.getNewGuidWithHash()
      tmpChannel = { id: id, name: 'Channel -' + hash, isNew: true }
    }
    return {
      channel: tmpChannel,
      oldChannelId: tmpChannel.id
    };
  },
  computed: {
    saveButtonText() {
      return this.channel.isNew ? 'Create' : 'Update'
    }
  },
  methods: {
    save() {
      if (this.channel.isNew) {
        this.$store.dispatch('channel/addChannel', this.channel)
          .then(this.$router.push({ name: 'channels' }))
      } else {
        this.$store.dispatch('channel/updateChannel', {
            oldChannelId: this.oldChannelId,
            channel: this.channel
          })
          .then(this.$router.push({ name: 'channels' }))
      }
    }
  }
}
</script>
