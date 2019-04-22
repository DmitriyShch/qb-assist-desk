import Vue from 'vue'
import Router from 'vue-router'
import Instances from './views/Instances.vue'
import InstanceCard from './views/InstanceCard.vue'
import Login from './views/Login.vue'
import Main from './views/Main.vue'
import Settings from './views/Settings.vue'
import InstanceManager from './views/InstanceManager.vue'
import Channels from './views/Channels.vue'
import ChannelCard from './views/ChannelCard.vue'
import Nodes from './views/Nodes.vue'
import Dashboard from './views/Dashboard.vue'
import store from './store/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/main/instances'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      children: [
        {
          path: 'settings',
          name: 'settings',
          components: {
            b: Settings
          }
        },
        {
          path: 'instances',
          name: 'instances',
          component: Instances
        },
        {
          path: 'instanceCard',
          name: 'instanceCard',
          component: InstanceCard,
          props: (route) => {
            const instanceId = Number.parseInt(route.params.instanceId)
            if (Number.isNaN(instanceId)) {
              return { instanceId: 0 }
            } else {
              return { instanceId }
            }
          },
        }
      ]
    },
    {
      path: '/im/:instanceId',
      name: 'instanceManager',
      component: InstanceManager,
      props: (route) => {
        const instanceId = Number.parseInt(route.params.instanceId)
        if (Number.isNaN(instanceId)) {
          return { instanceId: 0 }
        } else {
          return { instanceId }
        }
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          components: {
            b: Dashboard
          } 
        },
        {
          path: 'nodes',
          name: 'nodes',
          components: {
            b: Nodes
          } 
        },
        {
          path: 'channels',
          name: 'channels',
          components: {
            b: Channels
          } 
        },
        { 
          path: 'channels/:channelId',
          name: 'channelCard',
          props: {
            b: (route) => {
              console.log('route.params.channelId', route.params.channelId)
              return { channelId: route.params.channelId }
          }
        },
          components: {
            b: ChannelCard
          }
        },
        { 
          path: 'channels/new',
          name: 'newChannelCard',
          props: false,
          components: {
            b: ChannelCard
          } 
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach Pre to', to, 'from', from)
  if (store.getters.userLoginState < 0 && to.path != '/login') {
    store.dispatch('checkLogin', {
      callbackSignOut: () => next('/login')
    })
      .then(() => {
        console.log('checkLogin - true')
        next()
      })
      .catch(() => {
        console.log('checkLogin - false')
        next('/login')
      })
      return
  }

  if (store.getters.userLoginState == 0 && to.path != '/login') {
    next('/login')
    return
  }
  console.log('beforeEach Post to', to, 'from', from)
  next()
})

export default router
