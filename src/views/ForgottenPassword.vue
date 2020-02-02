<template>
  <div>
    <h1>Forgotten password</h1>
    <p v-show="!isResetSuccessful">
      No worries. Supply your email and password reset instructions will be sent to you!
    </p>

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"/>
    <LoadingMessage v-if="isWaitingForServer" :message="'Requesting reset, please wait...'"/>

    <form @submit.prevent="submitEmail" class="flex-col margin-top-10" v-show="!isResetSuccessful">
      <div>
        <label class="margin-right-4">Email:</label>
        <input type="text" v-model="email"/>
      </div>

      <button type="submit" class="theme-button big-button margin-top-10">
        Reset password
      </button>
    </form>

    <p v-show="isResetSuccessful" class="margin-top-10">
      <router-link :to="'/login'">
        <BackIcon title="Back"/> back to login
      </router-link>
    </p>
  </div>
</template>

<script>
import ResponseMessage from '../components/ResponseMessage.vue'
import LoadingMessage from '../components/LoadingMessage.vue'

import userApi from '../api/user-api'

import BackIcon from 'vue-material-design-icons/ArrowLeftCircle.vue'

export default {
  name: 'forgottenPassword',
  
  components: {
    ResponseMessage, LoadingMessage,
    BackIcon
  },

  data: function () {
    return {
      email: '',
      isWaitingForServer: false,
      responseMessage: '',
      responseMessageType: 'error',
      isResetSuccessful: false,
    }
  },

  methods: {
    async submitEmail () {
      if (this.isWaitingForServer) { return }
      this.isWaitingForServer = true

      let result = await userApi.resetPassword(this.email)

      this.isWaitingForServer = false

      if ('error' in result) {
        this.responseMessageType = 'error'
        this.responseMessage = result.error
      }
      else {
        this.responseMessageType = 'success'
        this.responseMessage = 'Success! Password reset instructions sent to your email'
        this.isResetSuccessful = true
      }
    },

    closeResponseMessage () {
      this.responseMessage = ''
    }
  },
}
</script>