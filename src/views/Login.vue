<template>
  <div class="flex-col">
    <h1>Login</h1>

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"/>

    <label style="margin-top: 10px;">Username or email</label>
    <input type="text" v-model="usernameOrEmail"/>
    <br/>

    <label>Password</label>
    <input type="password" v-model="password"/>
    <br/>

    <button @click="login" class="big-button theme-button">Log in</button>
  </div>
</template>

<script>
import ResponseMessage from '../components/ResponseMessage.vue'

export default {
  name: 'login',

  components: {
    ResponseMessage
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
