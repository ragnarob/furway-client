<template>
  <div class="flex-col">
    <h1>Login</h1>

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"/>

    <form @submit.prevent="login" class="flex-col">
      <label class="margin-top-10">Username or email</label>
      <input type="text" v-model="usernameOrEmail"/>

      <label class="margin-top-10">Password</label>
      <input type="password" v-model="password"/>
    </form>

    <button @click="login" class="big-button theme-button margin-top-10">
      <LoginIcon/> Log in
    </button>
  </div>
</template>

<script>
import ResponseMessage from '../components/ResponseMessage.vue'

import LoginIcon from 'vue-material-design-icons/Login.vue'

export default {
  name: 'login',

  components: {
    ResponseMessage, LoginIcon
  },

  data: function () {
    return {
      usernameOrEmail: '',
      password: '',
      responseMessage: '',
      responseMessageType: 'error',
    }
  },

  methods: {
    async login () {
      let loginResult = await this.$store.dispatch('login', 
        {usernameOrEmail: this.usernameOrEmail, password: this.password})

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
