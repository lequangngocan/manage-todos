import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Todo from '@/pages/Todo'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/todo',
      name: 'Todo',
      component: Todo,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('token')

  if (authRequired && !loggedIn) {
    return next('/')
  }
  if (!authRequired && loggedIn) {
    return next('/todo')
  }

  next()
})

export default router
