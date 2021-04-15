<template>
  <form class="login100-form validate-form">
      <span class="login100-form-title p-b-37">Sign In</span>
      <div class="wrap-input100 validate-input m-b-20">
        <input class="input100" type="text" placeholder="username" name="username" v-model="username" v-validate="'required'">
        <span class="focus-input100"></span>
      </div>

      <div class="wrap-input100 validate-input m-b-25">
        <input class="input100" type="password" placeholder="password" name="password" v-model="password" v-validate="'required'">
        <span class="focus-input100"></span>
      </div>

      <p>{{ msg }}</p>
      <p v-show="errors.has('username')">{{ errors.first('username') }}</p>
      <p v-show="errors.has('password')">{{ errors.first('password') }}</p>

      <div class="container-login100-form-btn">
        <button class="login100-form-btn" @click.prevent="login()">
          Sign In
        </button>
      </div>
      <div class="text-center p-t-20">
        <a href="#" class="txt2 hov1" @click="switchForm()">
          Register
        </a>
      </div>
    </form>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      msg: '',
      username: '',
      password: ''
    }
  },

  methods: {
    switchForm () {
      this.$store.state.isRegister = true
    },

    login () {
      let username = this.username
      let password = this.password
      if (!localStorage.getItem('token')) {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store.dispatch('login', {username, password})
              .then(() => this.$router.push('/todo'))
              .catch(error => {
                this.msg = 'Incorrect username or password'
                console.log(error)
              })
          }
        })
      }
    }
  },

  mounted () {
    this.$store.dispatch('getAllUser')
  },

  computed: {
    ...mapState([
      'users'
    ])
  }
}
</script>
