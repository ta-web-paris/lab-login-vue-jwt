<template>
  <section class="section" id="app">

    <router-link to="/login" v-if="!$root.user">Login</router-link>
    <p v-else>Hello {{ $root.user.name }}</p>

    <div class="container">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
import auth from './Auth/api'

export default {
  name: 'app',
  created() {
    // Try to load the user when the app is loaded
    // This happens only once
    auth.loadUser(this)
  }
}
</script>
