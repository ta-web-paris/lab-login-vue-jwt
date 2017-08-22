<template>
  <div>
    <article v-if="error" class="message is-danger">
      <div class="message-body">{{ error }}</div>
    </article>

    <div class="field">
      <label class="label">Username</label>
      <div class="control">
        <input class="input" v-model="username" type="text">
      </div>
    </div>

    <div class="field">
      <label class="label">Name</label>
      <div class="control">
        <input class="input" v-model="name" type="text">
      </div>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input class="input" v-model="password" type="password">
      </div>
    </div>

    <pre>{{ response }}</pre>
    <button @click="signup" class="button is-primary">Signup</button>
    <button @click="login" class="button is-success">Login</button>
    <a class="button" :href="facebookLogin">Facebook Login</a>
    <button @click="logout" class="button is-danger">Logout</button>
    <button @click="secret" class="button is-warning">Secret</button>
  </div>
</template>

<script>
import auth from './api'

// Make sure the facebook login url is good in production and dev mode
const facebookLogin = process.env.NODE_ENV === 'production'
  ? '/api/login/facebook'
  : 'http://localhost:3000/api/login/facebook'

export default {
  data() {
    return {
      response: '',
      username: '',
      name: '',
      password: '',
      error: '',
      facebookLogin
    }
  },
  methods: {
    signup() {
      this.error = ''
      auth.signup({
        username: this.username,
        password: this.password,
        name: this.name
      }).then((response) => {
        this.response = response
      }).catch(err => {
        this.error = err.response.data
      })
    },
    login() {
      auth.login(this.username, this.password, this).then((response) => {
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
      auth.logout(this)
    }
  }
}
</script>
