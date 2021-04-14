import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex, axios)

const userUrl = 'https://todo-mvc-api-typeorm.herokuapp.com/'
const todoUrl = 'https://606be500f8678400172e6b39.mockapi.io/'

export const store = new Vuex.Store({

  state: {
    users: [],
    todos: [],
    isRegister: true,
    time: Date(),
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
        .post(userUrl + 'auth/register', user)
        .then(response => {
          const token = response.data.token
          const user = response.data
          localStorage.setItem('token', token)
          axios.defaults.headers.common['Authorization'] = token
          commit('AUTH_SUCCESS', token, user)
        })
        .catch(error => {
          commit('AUTH_ERROR')
          localStorage.removeItem('token')
          console.log(error)
        })
    },

    async login ({commit}, user) {
      await axios
        .post(userUrl + 'auth/login', user)
        .then(response => {
          const token = response.data.token
          const user = response.data
          localStorage.setItem('token', token)
          axios.defaults.headers.common['Authorization'] = token
          commit('AUTH_SUCCESS', token, user)
        })
        .catch(error => {
          commit('AUTH_ERROR')
          localStorage.removeItem('token')
          console.log(error)
        })
    },

    logout ({commit}) {
      return new Promise((resolve, reject) => {
        commit('LOGOUT')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    },

    async getAllUser ({commit}) {
      await axios
        .get(userUrl + 'api/users')
        .then(response => {
          const data = response.data
          commit('SET_USERS', data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    async getAllTodos ({commit}) {
      await axios
        .get(todoUrl + 'todo')
        .then(response => {
          const data = response.data
          commit('SET_TODOS', data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    async addTodo ({commit}, todo) {
      await axios
        .post(todoUrl + 'todo', {'content': todo.content, 'status': todo.status, 'user': todo.user, 'created_at': this.state.time, 'updated_at': this.state.time}, {headers: {'Content-type': 'application/json'}})
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
        .put(todoUrl + 'todo/' + todo.id, {'content': todo.content, 'status': todo.status, 'updated_at': this.state.time}, {headers: {'Content-type': 'application/json'}})
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
        .delete(todoUrl + 'todo/' + id)
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
    AUTH_REQUEST () {
      Vue.status = 'loading'
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
