import { stringify } from "querystring";
import FirestoreApi from '../../api/firestore-api'

export const namespaced = true

export const mutations = {
  ADD_CHANNEL: (state, { instance, channel }) => {
    console.log('mutation ADD_CHANNEL -', stringify(channel))
    if (instance.channels == null) {
      instance.channels = [channel]
    } else {
      instance.channels.push(channel)
    }
  },
  UPDATE_CHANNEL: (state, { instance, oldChannelId, channel }) => {
    console.log('mutation UPDATE_CHANNEL - oldChannelId',
      oldChannelId, 'channel', stringify(channel))
    if (instance.channels == null) {
      console.error('instance.channels is null, instance: ',
        stringify(channel), ', oldChannelId:', oldChannelId)
    } else {
      const channels = instance.channels.filter(ch => ch.id == oldChannelId)
      if (channels && channels.length > 0) {
        const oldChannel = channels[0]
        oldChannel.id = channel.id
        oldChannel.name = channel.name
      }
    }
  },
  REMOVE_CHANNEL: (state, { instance, channelId }) => {
    console.log('mutation REMOVE_CHANNEL - ' + channelId)
    instance.channels = instance.channels.filter(ch => ch.id != channelId)
  },
  SET_CURRENT_CHANNEL: (state, channel) => {
    console.log('mutation SET_CHANNEL - channel -' + stringify(channel))
    state.currentChannel = channel
  }
}

export const actions = {
  addChannel: ({ commit, rootState }, channel) => {
    const instance = rootState.instance.currentInstance
    console.log('action addChannel', stringify(channel), stringify(instance))
    commit('ADD_CHANNEL', { instance, channel })
    FirestoreApi.saveInstance(instance)
  },
  updateChannel: ({ commit, rootState }, { oldChannelId, channel }) => {
    const instance = rootState.instance.currentInstance
    console.log('action updateChannel', oldChannelId, channel, stringify(instance))
    commit('UPDATE_CHANNEL', { instance, oldChannelId, channel })
    FirestoreApi.saveInstance(instance)
  },
  deleteChannel: ({ commit, rootState }, channelId) => {
    const instance = rootState.instance.currentInstance
    console.log('action deleteChannel - ' + channelId)
    commit('REMOVE_CHANNEL', { instance, channelId })
    FirestoreApi.saveInstance(instance)
  },
  getChannelById({ rootState }, channelId) {
    const instance = rootState.instance.currentInstance
    console.log('action getChannelById - ' + channelId)
    return new Promise((resolve, reject) => {
      const channels = instance.channels.filter(ch => ch.id == channelId)
      if (channels && channels.length > 0) {
        resolve(channels[0])
      } else {
        reject()
      }
    })
  }
}