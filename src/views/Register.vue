<template>
  <div class="flex-col">
    <h1>Registration</h1>

    <p v-if="!$store.state.isLoggedIn">
      You must <router-link :to="'/login'">log in</router-link> or <router-link :to="'/signup'">create a user</router-link> to register for Furway.
    </p>
    <p v-else-if="$store.state.userData.registrationId != null">
      You already have a registration, see <router-link :to="'/my-registration'">my registration</router-link>.
    </p>

    <div v-else>
      <label>Desired ticket type</label>
      <span>
        <input type="radio" v-model="roomPreference" value="insideonly"/> Inside only <br/>
        <input type="radio" v-model="roomPreference" value="insidepreference"/> Inside preference <br/> 
        <input type="radio" v-model="roomPreference" value="outsideonly"/> Outside only <br/>
      </span>

      <p>Info om at all tilleggsgreier som early, late, merch blir lagt til senere.</p>

      <button @click="submitRegistration">Submit registration</button>

      <p style="color: red" v-show="errorMessage">Error: {{errorMessage}}</p>
    </div>
  </div>
</template>

<script>
import registrationApi from '@/api/registration-api'

export default {
  name: 'register',

  data: function () {
    return {
      roomPreference: undefined,
      errorMessage: '',
    }
  },

  methods: {
    async submitRegistration () {
      let result = await registrationApi.submitRegistration(this.$store.state.userData.id, {roomPreference: this.roomPreference})

      if (result.success) {
        this.$store.dispatch('refreshUserData')
        this.errorMessage = 'Registration successful'
        this.$router.push('my-registration')
      }
      else {
        this.errorMessage = result.error
      }
    }
  }
}
</script>
