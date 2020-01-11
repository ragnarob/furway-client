<template>
  <div class="flex-col">
    <h1>Registration</h1>

    <p v-if="!$store.state.isLoggedIn">
      <!-- You must <router-link :to="'/login'">log in</router-link> or <router-link :to="'/signup'">create a user</router-link> to register for Furway. -->
      You must log in or create a user to register for Furway.
      <br>
      A user system with the possibilities to do this is coming soon!
    </p>

    <p v-if="!isRegistrationOpen" class="registration-countdown">
      Registration opens in {{timeUntilRegistrationString}}
    </p>
    <p v-else class="registration-countdown">
      Registration is open! Apply below.
    </p>

    <div class="full-width-text-container">
      <h3 class="no-margin-top">Registration information</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus mauris ultrices eros in cursus turpis. Velit sed ullamcorper morbi tincidunt ornare massa eget egestas. Consectetur lorem donec massa sapien faucibus et molestie. Tempus urna et pharetra pharetra massa massa. Consectetur libero id faucibus nisl tincidunt eget nullam non. Eu augue ut lectus arcu. Neque laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt. Arcu non sodales neque sodales ut etiam sit. Mattis enim ut tellus elementum. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Diam sit amet nisl suscipit. Eleifend donec pretium vulputate sapien. Dictum fusce ut placerat orci. Diam volutpat commodo sed egestas. Varius morbi enim nunc faucibus a. Velit ut tortor pretium viverra suspendisse potenti nullam.
      </p>

      <h3>Registration information 223</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus mauris ultrices eros in cursus turpis. Velit sed ullamcorper morbi tincidunt ornare massa eget egestas. Consectetur lorem donec massa sapien faucibus et molestie. Tempus urna et pharetra pharetra massa massa. Consectetur libero id faucibus nisl tincidunt eget nullam non. Eu augue ut lectus arcu. Neque laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt. Arcu non sodales neque sodales ut etiam sit. Mattis enim ut tellus elementum. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Diam sit amet nisl suscipit. Eleifend donec pretium vulputate sapien. Dictum fusce ut placerat orci. Diam volutpat commodo sed egestas. Varius morbi enim nunc faucibus a. Velit ut tortor pretium viverra suspendisse potenti nullam.
      </p>
    </div>


    <h2 v-if="$store.state.isLoggedIn">Create registration</h2>
    <p v-if="$store.state.isLoggedIn && $store.state.userData.registrationId != null">
      You already have a registration, see <router-link :to="'/my-registration'">my registration</router-link>.
    </p>

    <div v-if="$store.state.isLoggedIn && $store.state.userData.registrationId == null" style="text-align: left;">
      <p>Desired ticket type:</p>
      <div style="margin-top: 4px;">
        <input type="radio" v-model="roomPreference" value="insideonly"/> Inside only <br/>
        <input type="radio" v-model="roomPreference" value="insidepreference"/> Inside preference <br/> 
        <input type="radio" v-model="roomPreference" value="outsideonly"/> Outside only <br/>
      </div>

      <button @click="submitRegistration" class="big-button theme-button" style="margin-top: 10px;">Submit registration</button>

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

  computed: {
    isRegistrationOpen () {
      return  new Date() > new Date(this.$store.getters.conInfo.registrationOpenDate)
    },

    timeUntilRegistrationString () {
      if (this.isRegistrationOpen) { return 0 }
      let remainingSeconds = (new Date(this.$store.getters.conInfo.registrationOpenDate) - new Date ())/1000
      let remainingDays = Math.floor(remainingSeconds/(86400))
      let remainingHours = Math.floor((remainingSeconds-remainingDays*86400)/3600)
      let remainingMinutes = Math.ceil((remainingSeconds-remainingDays*86400-remainingHours*3600)/60)
      return `${remainingDays} days, ${remainingHours} hours, ${remainingMinutes} minutes`
    },
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

<style lang="scss">
.registration-countdown {
  font-size: 20px;
  font-weight: 600;
  margin: 20px;
}
</style>