<template>
  <div>
    Login in
  </div>
</template>

<script>
import auth from './api'

export default {
  created() {
    auth.loginFacebook(
      { name: this.$route.query.name },
      this.$route.query.token,
      this
    )
    // TODO handle errors
    this.$router.push('/')
  }
}
</script>
