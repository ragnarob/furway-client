<template>
  <div>
    <h1>Login</h1>

    <input type="text" v-model="usernameOrEmail"/>
    <input type="text" v-model="password"/>
    <button @click="login">Log in</button>
    <p style="color: red" v-show="loginErrorMessage">Error: {{loginErrorMessage}}</p>
  </div>
</template>

<script>
export default {
  name: 'login',

  data: function () {
    return {
      usernameOrEmail: '',
      password: '',
      loginErrorMessage: '',
    }
  },

  methods: {
    async login () {
      let loginResult = await this.$store.dispatch('login', 
        {usernameOrEmail: this.usernameOrEmail, password: this.password})

      if (loginResult.success) {
        this.loginErrorMessage = 'logged in'
        this.$router.push('my-profile')
      }
      else {
        this.loginErrorMessage = loginResult.error
      }
    }
  }
}
</script>
