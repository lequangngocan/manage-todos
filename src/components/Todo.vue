<template>
  <div class="container-login100">
    <div class="todo-page container">
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <button type="button" class="btn btn-secondary button-left" @click="logout()">Logout</button>
          <button type="button" class="btn btn-danger" v-show="isActive === 'LIST'" @click="deleteMultipleTodo()">Delete Selected</button>
        </div>
        <div class="col-md-6 col-sm-12">
          <h1 class="title p-b-30 p-t-30">Hi {{ this.$store.state.user.username }} !</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 col-sm-12">
          <div class="list-group">
            <button class="list-group-item list-group-item-action" :class="{active: isActive === 'LIST' || isActive === 'EDIT'}" @click="isActive = 'LIST'">Todo List</button>
            <button class="list-group-item list-group-item-action" :class="{active: isActive === 'ADD'}" @click="isActive = 'ADD'; content = ''">New Todo</button>
          </div>
        </div>
        <div class="col-md-9 col-sm-12 overflow-auto">
          <table class="table" v-if="isActive === 'LIST'">
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
          <form v-if="isActive === 'ADD'" @submit.prevent="addTodo()">
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Content</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" placeholder="Content" name="content" v-model="content" v-validate="'required'">
                <p v-show="errors.has('content')">{{ errors.first('content') }}</p>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <button type="submit" class="btn btn-primary">Create New Todo</button>
              </div>
            </div>
          </form>
          <form v-if="isActive === 'EDIT'" @submit.prevent="saveEdit()">
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Content</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" :placeholder="this.content" name="content" v-model="content" v-validate="'required'">
                <p v-show="errors.has('content')">{{ errors.first('content') }}</p>
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
      isActive: ['LIST', 'ADD', 'EDIT'],
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

    getTodo (id) {
      for (let i = 0; i < this.todos.length; i++) {
        if (this.todos[i].id === id) {
          return this.todos[i]
        }
      }
    },

    addTodo () {
      let content = this.content
      this.$store.dispatch('addTodo', {content})
      this.isActive = 'LIST'
    },

    editTodo (id) {
      this.isActive = 'EDIT'
      this.content = this.getTodo(id).content
      this.status = this.getTodo(id).status
      this.todoId = id
    },

    saveEdit () {
      this.isActive = 'LIST'
      let id = this.todoId
      let content = this.content
      let status = this.status
      this.$store.dispatch('editTodo', {id, status, content})
      alert('Edit successfully')
    },

    deleteTodo (id) {
      if (confirm('Do you really want to delete?')) {
        this.$store.dispatch('deleteTodo', id)
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
      if (confirm('Do you really want to delete ' + this.selected.length + ' item?')) {
        for (let i = 0; i < this.selected.length; i++) {
          this.$store.dispatch('deleteTodo', this.selected[i])
        }
        this.selectAll = false
      }
    }
  },

  computed: {
    ...mapState([
      'todos'
    ])
  },

  mounted () {
    this.$store.dispatch('getTodos')
  },

  filters: {
    moment: function (date) {
      return moment(String(date)).format('YYYY-MM-DD hh:mm:ss a')
    }
  },

  created () {
    this.isActive = 'LIST'
  }
}
</script>
