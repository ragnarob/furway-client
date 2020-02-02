<template>
  <div class="flex-col">
    <h1>Login</h1>

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"/>
    <LoadingMessage :message="'Logging in...'" v-if="isLoggingIn"/>

    <form @submit.prevent="login" class="flex-col">
      <label class="margin-top-10">Username or email</label>
      <input type="text" v-model="usernameOrEmail"/>

      <label class="margin-top-10">Password</label>
      <input type="password" v-model="password"/>

      <button @click="login" class="big-button theme-button margin-top-20">
        <LoginIcon title="Login"/> Log in
      </button>

      <router-link :to="'/forgotten-password'" class="margin-top-20">Forgot password?</router-link>
    </form>
  </div>
</template>

<script>
import ResponseMessage from '../components/ResponseMessage.vue'
import LoadingMessage from '../components/LoadingMessage.vue'

import LoginIcon from 'vue-material-design-icons/Login.vue'

export default {
  name: 'login',

  components: {
    ResponseMessage, LoadingMessage,
    LoginIcon,
  },

  data: function () {
    return {
      usernameOrEmail: '',
      password: '',
      responseMessage: '',
      responseMessageType: 'error',
      isLoggingIn: false,
    }
  },

  methods: {
    async login () {
      if (this.isLoggingIn) { return }

      this.isLoggingIn = true

      let loginResult = await this.$store.dispatch('login', 
        {usernameOrEmail: this.usernameOrEmail, password: this.password})

      this.isLoggingIn = false

      if (loginResult.success) {
        this.responseMessage = 'Success'
        this.responseMessageType = 'success'
        this.loginErrorMessage = 'logged in'
        this.$router.push('my-profile')
      }
      else {
        this.responseMessage = loginResult.error
        this.responseMessageType = 'error'
      }
    },

    closeResponseMessage () {
      this.responseMessage = ''
    },
  }
}
</script>
