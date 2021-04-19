<template>
  <div class="container-login100">
    <div class="todo-page container">
      <div class="row p-b-30 list-button">
        <div class="col-md-12 col-xs-12 col-sm-12 p-b-20">
          <h1 class="title">Hi {{ this.$store.state.user.username }} !</h1>
        </div>
        <div class="col-md-3 col-sm-6 col-xs-12 p-t-10 p-b-10">
          <button class="list-group-item list-group-item-action" :class="{active: isTabs === 'LIST' || isTabs === 'EDIT'}" @click="isTabs = 'LIST'">Todo List</button>
        </div>
        <div class="col-md-3 col-sm-6 col-xs-12 p-t-10 p-b-10">
          <button class="list-group-item list-group-item-action bg-add" :class="{active: isTabs === 'ADD'}" @click="isTabs = 'ADD'; content = ''">New Todo</button>
        </div>
        <div class="col-md-3 col-sm-6 col-xs-12 p-t-10 p-b-10" v-if="isTabs === 'LIST'">
          <button type="button" class="btn btn-danger" @click="deleteMultipleTodo()">Delete Selected</button>
        </div>
        <div class="col-md-3 col-sm-6 col-xs-12 p-t-10 p-b-10">
          <button type="button" class="btn btn-secondary float-right" @click="logout()">Logout</button>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 col-sm-12 overflow-auto">
          <table class="table" v-if="isTabs === 'LIST'">
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
              <td><span>{{ moment(todo.created_at).format('YYYY-MM-DD hh:mm:ss a') }}</span></td>
              <td><span>{{ moment(todo.updated_at).format('YYYY-MM-DD hh:mm:ss a') }}</span></td>
              <td>
                <button type="button" class="btn btn-primary" @click="editTodo(todo.id)">Edit</button>
                <button type="button" class="btn btn-danger" @click="deleteTodo(todo.id)">Delete</button>
              </td>
            </tr>
            </tbody>
          </table>
          <form v-if="isTabs === 'ADD'" @submit.prevent="addTodo()">
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Content</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" placeholder="Content" name="content" v-model="content" v-validate="'required'">
                <p v-show="errors.has('content')">{{ errors.first('content') }}</p>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <button type="submit" class="btn btn-success">Create New Todo</button>
              </div>
            </div>
          </form>
          <form v-if="isTabs === 'EDIT'" @submit.prevent="saveEdit()">
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
                <button type="submit" class="btn btn-success">Save Edit</button>
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

export default {
  name: 'Todo',

  data () {
    return {
      isTabs: ['LIST', 'ADD', 'EDIT'],
      content: '',
      status: '',
      todoId: null,
      selected: [],
      selectAll: false
    }
  },

  computed: {
    ...mapState([
      'todos'
    ])
  },

  created () {
    this.isTabs = 'LIST'
  },

  mounted () {
    this.$store.dispatch('getTodos')
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
      this.$store.dispatch('addTodo', {'content': this.content})
      this.isTabs = 'LIST'
    },

    editTodo (id) {
      this.isTabs = 'EDIT'
      this.content = this.getTodo(id).content
      this.status = this.getTodo(id).status
      this.todoId = id
    },

    saveEdit () {
      this.isTabs = 'LIST'
      this.$store.dispatch('editTodo', {'id': this.todoId, 'status': this.status, 'content': this.content})
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
  }
}
</script>
<style scoped>
.list-group-item {
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.list-group-item.bg-add {
  z-index: 2;
  background-color: #5cb85c;
  border-color: #5cb85c;
}

.list-button .btn {
  width: 100%;
}
</style>
