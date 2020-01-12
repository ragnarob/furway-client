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

    <div class="full-width-text-container left-aligned-text">
      <h3 class="no-margin-top">Registration information</h3>


      <p>
        This year the registration system is vastly different from earlier. There are three main “stages” to completing a registration:
      </p>

      <h4>
        1: Creating a user
      </h4>
      <p>
        This can be done at any time as soon as the user system is up and running.
      </p>

      <h4>
        2: Registering
      </h4>
      <p>
        This can be done as soon as registration opens - or even sooner for volunteers. When creating a registration, you will only submit your desired ticket type - inside only, outside only, or inside preference. Inside preference means that you will get an inside spot if one is available, otherwise an outside spot if that’s available. Note that if you have this ticket type and receive an inside spot, you can not choose to take an outside spot instead.
      </p>

      <p>
        After your registration has been submitted, admins have to manually approve it. When approved, you will receive your registration number and have access to step 3.
      </p>

      <h4>
        2.5: Waiting list
      </h4>
      <p>
        If all spots of your desired types are full (inside, outside), you will be placed in a waiting list. The waiting lists are public, and can be viewed on this page as soon as registration opens.
      </p>

      <h4>
        3: Adding add-ons and paying
      </h4>      
      <p>
        Once you have received a spot either inside or outside you may purchase add-ons such as early arrival, late departure, and merch. You may also pay. Payment will most likely be available via Vipps for Norwegian attendees, or via credit card for anyone. There will be a final payment date, and if you have not paid within this date, you will lose your spot.
      </p>
    </div>


    <!-- <h2 v-if="$store.state.isLoggedIn">Create registration</h2>
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
    </div> -->
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

<style lang="scss" scoped>
h4 {
  margin-top: 16px;
}
h3 {
  margin-top: 0px;
}
</style>