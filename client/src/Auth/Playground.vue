<template>
  <div>
    <div class="field">
      <label class="label">Username</label>
      <div class="control">
        <input class="input" v-model="username" type="text">
      </div>
    </div>

    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input class="input" type="text">
      </div>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input class="input" v-model="password" type="password">
      </div>
    </div>

    <pre>{{ response }}</pre>
    <pre>{{ error }}</pre>
    <button @click="signup" class="button is-primary">Signup</button>
    <button @click="login" class="button is-success">Login</button>
    <button @click="logout" class="button is-danger">Logout</button>
    <button @click="secret" class="button is-warning">Secret</button>
  </div>
</template>

<script>
import auth from './api'

export default {
  data() {
    return {
      response: '',
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    signup() {
      auth.signup(this.username, this.password).then((response) => {
        this.response = response
      })
    },
    login() {
      auth.login(this.username, this.password).then((response) => {
        this.response = response
      }).catch(err => {
        this.error = err
      })
    },
    secret() {
      auth.secret().then(response => {
        this.response = response
      }).catch(err => {
        this.response = err
      })
    },
    logout() {
      auth.logout()
    }
  }
}
</script>
