<template>
  <div class="container-login100">
    <div class="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-80">
      <div v-if="this.$store.state.isRegister"><Register /></div>
      <div v-else><Login /></div>
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
  }
}
</script>
