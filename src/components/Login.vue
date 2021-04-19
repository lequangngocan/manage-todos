<template>
  <div class="container-login100">
    <div class="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-80">
      <form class="login100-form validate-form" @submit.prevent="login()">
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
            <button class="login100-form-btn">
              Sign In
            </button>
          </div>
      </form>
      <div class="text-center">
        <router-link :to="{name:'Register'}" class="txt2 hov1">Register</router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      msg: '',
      username: '',
      password: ''
    }
  },

  methods: {
    login () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$store.dispatch('login', { 'username': this.username, 'password': this.password })
            .then(() => {
              if (this.$store.state.status === 'success') {
                this.$router.push({name: 'Todo'})
              } else {
                this.msg = 'Incorrect username or password'
              }
            })
        }
      })
    }
  }
}
</script>
