import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex, axios)

const baseUrl = 'https://todo-mvc-api-typeorm.herokuapp.com/'

export const store = new Vuex.Store({

  state: {
    users: [],
    todos: [],
    isActive: true,
    token: localStorage.getItem('token') || '',
    user: {},
    status: ''
  },

  getters: {
    allUsername: state => {
      return state.users.map(user => user.username)
    }
  },

  actions: {
    async register ({commit}, user) {
      await axios
        .post(baseUrl + 'auth/register', user)
        .then(response => {
          const token = response.data.token
          const user = response.data
          commit('AUTH_SUCCESS', token, user)
        })
        .catch(error => {
          commit('AUTH_ERROR')
          console.log(error)
        })
    },

    async login ({commit}, user) {
      await axios
        .post(baseUrl + 'auth/login', user)
        .then(response => {
          const token = response.data.token
          const user = response.data
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
          localStorage.setItem('token', token)
          commit('AUTH_SUCCESS', token, user)
        })
        .catch(error => {
          commit('AUTH_ERROR')
          localStorage.removeItem('token')
          console.log(error)
        })
    },

    logout ({commit}) {
      commit('LOGOUT')
      localStorage.removeItem('token')
    },

    async getAllUser ({commit}) {
      await axios
        .get(baseUrl + 'api/users')
        .then(response => {
          const data = response.data
          commit('SET_USERS', data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    async getTodos ({commit}) {
      await axios
        .get(baseUrl + 'api/todos')
        .then(response => {
          const data = response.data.items
          commit('SET_TODOS', data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    async addTodo ({commit}, todo) {
      await axios
        .post(baseUrl + 'api/todos', todo)
        .then(response => {
          const data = response.data
          commit('ADD_TODOS', data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    async editTodo ({commit}, todo) {
      await axios
        .put(baseUrl + 'api/todos/' + todo.id, { 'status': todo.status, 'content': todo.content })
        .then(response => {
          const data = response.data
          commit('EDIT_TODOS', data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    async deleteTodo ({commit}, id) {
      await axios
        .delete(baseUrl + 'api/todos/' + id)
        .then(response => {
          commit('DELETE_TODOS', id)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },

  mutations: {
    SET_USERS (state, users) {
      Vue.set(state, 'users', users)
    },

    AUTH_SUCCESS (token, user) {
      Vue.status = 'success'
      Vue.token = token
      Vue.user = user
    },

    AUTH_ERROR () {
      Vue.status = 'error'
    },

    LOGOUT () {
      Vue.status = ''
      Vue.token = ''
    },

    SET_TODOS (state, todos) {
      Vue.set(state, 'todos', todos)
    },

    ADD_TODOS (state, data) {
      Vue.set(state.todos, state.todos.length, data)
    },

    EDIT_TODOS (state, data) {
      const index = state.todos.findIndex(todo => todo.id === data.id)
      data.created_at = state.todos[index].created_at
      if (index !== -1) {
        Vue.set(state.todos, index, data)
      }
    },

    DELETE_TODOS (state, id) {
      const index = state.todos.findIndex(todo => todo.id === id)
      Vue.delete(state.todos, index)
    }
  }
})
