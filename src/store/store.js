import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex, axios)

axios.defaults.baseURL = 'https://todo-mvc-api-typeorm.herokuapp.com/'

export const store = new Vuex.Store({

  state: {
    todos: [],
    user: {},
    status: ''
  },

  actions: {
    async register ({commit}, user) {
      await axios
        .post('auth/register', user)
        .then(() => {
          commit('AUTH_SUCCESS')
        })
        .catch(error => {
          commit('AUTH_ERROR')
          console.log(error)
        })
    },

    async login ({commit}, user) {
      await axios
        .post('auth/login', user)
        .then(response => {
          const token = response.data.token
          const user = response.data
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
          localStorage.setItem('token', token)
          commit('AUTH_SUCCESS', user)
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

    async getTodos ({commit}) {
      await axios
        .get('api/todos')
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
        .post('api/todos', todo)
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
        .put('api/todos/' + todo.id, { 'status': todo.status, 'content': todo.content })
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
        .delete('api/todos/' + id)
        .then(response => {
          commit('DELETE_TODOS', id)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },

  mutations: {
    AUTH_SUCCESS (state, user) {
      Vue.set(state, 'status', 'success')
      Vue.set(state, 'user', user)
    },

    AUTH_ERROR (state) {
      Vue.set(state, 'status', 'error')
    },

    LOGOUT (state) {
      Vue.set(state, 'status', '')
      Vue.set(state, 'user', {})
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
