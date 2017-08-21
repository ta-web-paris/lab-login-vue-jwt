<template>
  <div>
    <b-notification type="is-danger" :closable="false" v-if="error">{{ error }}</b-notification>
    <form @submit.prevent="login">
      <b-field label="Username">
        <b-input v-model="username" type="text" required></b-input>
      </b-field>

      <b-field label="Password">
        <b-input v-model="password" type="password" required></b-input>
      </b-field>

      <button class="button is-primary" :class="buttonClasses">Login</button>
    </form>
  </div>
</template>

<script>
import auth from './api'

export default {
  data() {
    return {
      error: '',
      loading: false,
      username: '',
      password: ''
    }
  },
  computed: {
    buttonClasses() {
      return {
        'is-loading': this.loading
      }
    }
  },
  methods: {
    login() {
      // cleanup the error while fetching
      this.error = ''
      // set the state to loading to display the button as loading
      this.loading = true
      auth.login(this.username, this.password).then((response) => {
        // Redirect the user to Home
        this.$router.push('/')
      }).catch(err => {
        // Display the error message
        this.error = err.message
      }).then(() => {
        // set the state back to normal
        this.loading = false
      })
    }
  }
}
</script>
