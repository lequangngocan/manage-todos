<template>
  <div class="container-login100">
    <router-link :to="{name:'Register'}" class="p-t-20 p-r-20 p-b-20 p-l-20">
      <div class="container-login100-form-btn">
        <button class="login100-form-btn">
          Register
        </button>
      </div>
    </router-link>
    <router-link :to="{name:'Login'}" class="p-t-20 p-r-20 p-b-20 p-l-20">
      <div class="container-login100-form-btn">
        <button class="login100-form-btn">
          Login
        </button>
      </div>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'Index'
}
</script>
