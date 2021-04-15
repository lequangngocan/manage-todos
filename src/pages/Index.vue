<template>
  <div class="container-login100">
    <div class="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-80">
      <div v-if="this.$store.state.isActive">
        <Register />
        <a href="#" class="txt2 hov1" @click="switchActive">
          Login
        </a>
      </div>
      <div v-else>
        <Login />
        <div class="text-center p-t-20">
          <a href="#" class="txt2 hov1" @click="switchActive">
            Register
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Register from '../components/Register'
import Login from '../components/Login'

export default {
  name: 'Index',

  components: {
    Register,
    Login
  },

  methods: {
    switchActive () {
      this.$store.state.isActive = !this.$store.state.isActive
    }
  }
}
</script>
