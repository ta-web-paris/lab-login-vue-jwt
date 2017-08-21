<template>
  <section class="section" id="app">
    <router-link to="/login">Login</router-link>
    <div class="container">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
export default {
  name: 'app'
}
</script>
