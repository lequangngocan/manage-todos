<template>
  <form class="login100-form validate-form" @submit.prevent="register()">
    <span class="login100-form-title p-b-37">Register</span>
    <div class="wrap-input100 validate-input m-b-20">
      <input class="input100" type="text" placeholder="username" name="username" v-model="username" v-validate="{ required: true, regex: /^[a-zA-Z0-9_]+$/ }">
      <span class="focus-input100"></span>
    </div>

    <div class="wrap-input100 validate-input m-b-25">
      <input class="input100" v-validate="{ required: true, regex: /^[a-zA-Z0-9_]{4,}$/ }" name="password" type="password" v-model="password" placeholder="password" ref="password">
      <span class="focus-input100"></span>
    </div>

    <div class="wrap-input100 validate-input m-b-25">
      <input class="input100" v-validate="'required|confirmed:password'" name="password_confirmation" type="password" placeholder="confirm password" data-vv-as="password" v-model="repassword">
      <span class="focus-input100"></span>
    </div>

    <p>{{ msg }}</p>
    <p v-show="errors.has('username')">{{ errors.first('username') }}</p>
    <p v-show="errors.has('password')">{{ errors.first('password') }}</p>
    <p v-show="errors.has('password_confirmation')">{{ errors.first('password_confirmation') }}</p>

    <div class="container-login100-form-btn">
      <button class="login100-form-btn">
        Register
      </button>
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

    register () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          if (!this.allUsername.includes(this.username)) {
            let username = this.username
            let password = this.password
            this.$store.dispatch('register', {username, password})
            alert('Account successfully created')
            this.$store.state.isActive = false
          } else {
            this.msg = 'This account has already existed'
          }
        }
      })
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
