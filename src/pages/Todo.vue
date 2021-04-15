<template>
  <div class="container-login100">
    <div class="todo-page container">
      <div class="row" v-if="this.getUser()">
        <div class="col-md-6 col-sm-12">
          <button type="button" class="btn btn-secondary pull-left" style="float:left;" @click="logout()">Logout</button>
          <button type="button" class="btn btn-danger" v-show="isActive === 1" @click="deleteMultipleTodo()">Delete Selected</button>
        </div>
        <div class="col-md-6 col-sm-12">
          <h1 class="title p-b-30 p-t-30">Hi, {{ this.getUser().username }} !</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 col-sm-12">
          <div class="list-group">
            <button class="list-group-item list-group-item-action" :class="{active: isActive === 1 || isActive === 3}" @click="isActive = 1">Todo List</button>
            <button class="list-group-item list-group-item-action" :class="{active: isActive === 2}" @click="isActive = 2; content = ''">New Todo</button>
          </div>
        </div>
        <div class="col-md-9 col-sm-12" style="overflow-x: auto">
          <table class="table" v-if="isActive === 1">
            <thead>
              <tr>
                <th scope="col">
                  <input type="checkbox" v-model="selectAll" @click="select">
                </th>
                <th scope="col">#</th>
                <th scope="col">Content</th>
                <th scope="col">Status</th>
                <th scope="col">Created At</th>
                <th scope="col">Updated At</th>
                <th scope="col">Active</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(todo, index) in this.todos" :key="index">
                <td><input type="checkbox" :value="todo.id" v-model="selected"></td>
                <th scope="row"><span>{{ index }}</span></th>
                <td><span>{{ todo.content }}</span></td>
                <td>
                  <span>{{ todo.status }}</span>
                </td>
                <td><span>{{ todo.created_at | moment }}</span></td>
                <td><span>{{ todo.updated_at | moment }}</span></td>
                <td>
                  <button type="button" class="btn btn-primary" @click="editTodo(todo.id)">Edit</button>
                  <button type="button" class="btn btn-danger" @click="deleteTodo(todo.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <form v-if="isActive === 2" @submit.prevent="addTodo()">
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Content</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" placeholder="Content" v-model="content">
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <button type="submit" class="btn btn-primary">Create New Todo</button>
              </div>
            </div>
          </form>
          <form v-if="isActive === 3" @submit.prevent="saveEdit()">
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Content</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" :placeholder="this.content" v-model="content">
                <span>{{ msg }}</span>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Status</label>
              <div class="col-sm-10">
                <select class="form-select" aria-label="Default select example" v-model="status">
                  <option value="active">active</option>
                  <option value="completed">completed</option>
                </select>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <button type="submit" class="btn btn-primary">Save Edit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      msg: '',
      isActive: 1,
      content: '',
      status: '',
      todoId: null,
      selected: [],
      selectAll: false
    }
  },

  methods: {
    logout () {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/')
        })
    },

    getUser () {
      const id = this.parseJwt(localStorage.getItem('token')).id
      for (let i = 0; i < this.users.length; i++) {
        if (id === this.users[i].id) {
          return this.users[i]
        }
      }
    },

    getTodo (id) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].id === id) {
          return this.todos[i]
        }
      }
    },

    addTodo () {
      if (this.content === '') {
        this.msg = 'Content is empty'
      } else {
        if (this.status === '') {
          this.status = 'Inactive'
        }
        let content = this.content
        let user = this.getUser()
        this.$store.dispatch('addTodo', {content, user})
        this.isActive = 1
      }
    },

    editTodo (id) {
      this.isActive = 3
      this.content = this.getTodo(id).content
      this.status = this.getTodo(id).status
      this.todoId = id
    },

    saveEdit () {
      if (this.getUser()) {
        this.isActive = 1
        let id = this.todoId
        let content = this.content
        let status = this.status
        this.$store.dispatch('editTodo', {id, status, content})
        alert('Edit successfully')
      }
    },

    deleteTodo (id) {
      if (this.getUser()) {
        if (confirm('Do you really want to delete?')) {
          this.$store.dispatch('deleteTodo', id)
        }
      }
    },

    select () {
      this.selected = []
      if (!this.selectAll) {
        for (let i in this.todos) {
          this.selected.push(this.todos[i].id)
        }
      }
    },

    deleteMultipleTodo () {
      if (this.getUser()) {
        if (confirm('Do you really want to delete ' + this.selected.length + ' item?')) {
          for (let i = 0; i < this.selected.length; i++) {
            this.$store.dispatch('deleteTodo', this.selected[i])
          }
          this.selectAll = false
        }
      }
    },

    parseJwt (token) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    }
  },

  computed: {
    ...mapState([
      'users',
      'todos'
    ])
  },

  mounted () {
    this.$store.dispatch('getAllUser')
    this.$store.dispatch('getTodos')
  },

  filters: {
    moment: function (date) {
      return moment(String(date)).format('YYYY-MM-DD hh:mm:ss a')
    }
  }
}
</script>
