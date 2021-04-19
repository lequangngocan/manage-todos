<template>
  <div class="container-login100">
    <router-link :to="{name:'Register'}" class="p-4">
      <div class="container-login100-form-btn">
        <button class="login100-form-btn">
          Register
        </button>
      </div>
    </router-link>
    <router-link :to="{name:'Login'}" class="p-4">
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
