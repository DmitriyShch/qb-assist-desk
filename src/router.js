import Vue from 'vue'
import Router from 'vue-router'
import Applications from './views/Applications.vue'
import ApplicationCard from './views/ApplicationCard.vue'
import Login from './views/Login.vue'
import Main from './views/Main.vue'
import Settings from './views/Settings.vue'
import ApplicationManager from './views/ApplicationManager.vue'
import Forms from './views/Forms.vue'
import FormCard from './views/FormCard.vue'
import Structure from './views/Structure.vue'
import Dashboard from './views/Dashboard.vue'
import store from './store/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/main/applications'
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
          path: 'applications',
          name: 'applications',
          component: Applications
        },
        {
          path: 'applicationCard',
          name: 'applicationCard',
          component: ApplicationCard,
          props: true
          // (route) => {
          //   const applicationId = Number.parseInt(route.params.applicationId)
          //   if (Number.isNaN(applicationId)) {
          //     return { applicationId: 0 }
          //   } else {
          //     return { applicationId }
          //   }
          // },
        }
      ]
    },
    {
      path: '/im/:applicationId',
      name: 'applicationManager',
      component: ApplicationManager,
      props: (route) => {
        const applicationId = Number.parseInt(route.params.applicationId)
        if (Number.isNaN(applicationId)) {
          return { applicationId: 0 }
        } else {
          return { applicationId }
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
            b: Structure
          } 
        },
        {
          path: 'forms',
          name: 'forms',
          components: {
            b: Forms
          } 
        },
        { 
          path: 'forms/:formId',
          name: 'formCard',
          props: {
            b: (route) => {
              console.log('route.params.formId', route.params.formId)
              return { formId: route.params.formId }
          }
        },
          components: {
            b: FormCard
          }
        },
        { 
          path: 'forms/new',
          name: 'newFormCard',
          props: false,
          components: {
            b: FormCard
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
