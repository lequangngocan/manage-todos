<template>
  <form class="login100-form validate-form">
    <span class="login100-form-title p-b-37">Register</span>
    <div class="wrap-input100 validate-input m-b-20">
      <input class="input100" type="text" placeholder="username" v-model="username">
      <span class="focus-input100"></span>
    </div>

    <div class="wrap-input100 validate-input m-b-25">
      <input class="input100" type="password" placeholder="password" v-model="password">
      <span class="focus-input100"></span>
    </div>

    <div class="wrap-input100 validate-input m-b-25">
      <input class="input100" type="password" placeholder="confirm password" v-model="repassword">
      <span class="focus-input100"></span>
    </div>

    <span>{{ msg }}</span>

    <div class="container-login100-form-btn">
      <button class="login100-form-btn" @click.prevent="register()">
        Register
      </button>
    </div>
    <div class="text-center p-t-20">
      <a href="#" class="txt2 hov1" @click="switchForm()">
        Sign In
      </a>
    </div>
  </form>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Register',

  data () {
    return {
      msg: '',
      username: '',
      password: '',
      repassword: ''
    }
  },

  methods: {
    switchForm () {
      this.$store.state.isRegister = false
    },

    checkUserName (username) {
      let nameRegex = /^[a-zA-Z0-9_]+$/
      if (username.match(nameRegex)) {
        return true
      }
      return false
    },
    checkPassword (password) {
      let passwordRegex = /^[a-zA-Z0-9_]{4,}$/
      if (password.match(passwordRegex)) {
        return true
      }
      return false
    },

    register () {
      if (this.checkUserName(this.username) && this.checkPassword(this.password) && !this.allUsername.includes(this.username) && this.password === this.repassword) {
        let username = this.username
        let password = this.password
        this.$store.dispatch('register', {username, password})
        alert('Account successfully created')
        this.switchForm()
      } else {
        this.msg = 'Username is not properly formatted or already exists'
      }
    }
  },

  mounted () {
    this.$store.dispatch('getAllUser')
  },
  computed: {
    ...mapGetters([
      'allUsername'
    ])
  }
}
</script>
