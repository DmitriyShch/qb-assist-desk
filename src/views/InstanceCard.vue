<template>
  <form @submit.prevent="save">
    <div class="instance-create">
      <label for="id">Id</label>
      <input id="id" type="text" v-model="instance.id">
      <label for="name">Name</label>
      <input id="name" type="text" v-model="instance.name">
      <button type="submit">{{saveButtonText}}</button>
    </div>
  </form>
</template>

<script>
import { stringify } from 'querystring';
import utils from '../api/utils';

export default {
  props: {
    instanceId: {
      type: String,
      required: false
    },
  },
  data() {
    let tmpInstance = {}
    console.log('InstanceCard - data - instanceId:', this.instanceId)
    if (this.instanceId != null) {
      this.$store.dispatch('instance/setCurrentInstanceById', this.instanceId)
        .then((instance) => {
          instance.isNew = false
          this.instance = instance
        })
        .catch((err) => {
          console.log(err)
          tmpInstance = this.createNewInstance()
          tmpInstance.isNew = true
          this.instance = tmpInstance
        })
    } else {
      tmpInstance = this.createNewInstance()
      tmpInstance.isNew = true
    }

    return {
      instance: tmpInstance,
      originalInstanceId: tmpInstance.id
    };
  },
  computed: {
    saveButtonText() {
      return this.instance.isNew ? 'Create' : 'Update'
    }
  },
  methods: {
    createNewInstance() {
      let objectId = utils.getNewGuid()
      let newid = this.$store.getters['instance/getNewInstanceId']
      return {
        objectId: objectId,
        id: newid,
        name: "instance - " + newid,
        channels: [
          {id: 1, name: 'channel1'},
          {id: 2, name: 'channel2'},
        ]
      };
    },
    save() {
      console.log('save', stringify(this.instance))
      if (this.instance.isNew) {
        this.$store
          .dispatch('instance/createInstance', this.instance)
          .then(this.$router.push('instances'))
      } else {
        this.$store
          .dispatch('updateInstance', {
            instanceId: this.originalInstanceId,
            updatedInstance: this.instance
          })
          .then(this.$router.push('instances'))
      }
    }
  }
};
</script>
