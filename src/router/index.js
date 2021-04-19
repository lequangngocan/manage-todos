import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Index from '@/components/Index'
import Todo from '@/components/Todo'

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
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/todo',
      name: 'Todo',
      component: Todo
    }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register']
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
