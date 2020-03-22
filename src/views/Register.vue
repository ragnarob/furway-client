<template>
  <div class="flex-col">
    <h1 class="margin-bottom-10">Registration</h1>
    <!-- <p style="font-style: italic; font-size: 12px;">Note: Registration might not work as intended with the Safari browser.<br/>Consider using something else, like Chrome, for the best chance of success.</p> -->

    <ResponseMessage :message="responseMessage" :messageType="messageType" @closeMessage="closeResponseMessage" v-if="responseMessage"/>

    <div v-if="!isOrderingSingleDayTicket && !isCreatingRegistration">
      <div v-if="!isRegistrationOpen && !isRegistrationClosed" class="registration-countdown">
        <p v-if="!isRegistrationOpen && $store.getters.conInfo.registrationOpenDate">
          Registration opens in {{timeUntilRegistrationString}}
        </p>
        <p v-if="!isRegistrationOpen">
          March 1st, 20:00 CET
        </p>
      </div>

      <div v-else-if="isRegistrationClosed" class="margin-top-20">
        Registration is closed.
      </div>

      <div v-else-if="isRegistrationOpen">
        <p v-if="!$store.state.isLoggedIn">
          Registration is open! You must <router-link :to="'/login'">log in</router-link> or <router-link :to="'/signup'">create a user</router-link> to register for Furway.
        </p>

        <!-- CREATING REGISTRATION -->
        <p v-if="$store.state.isLoggedIn && $store.getters.hasRegistration">
          You already have a registration, see <router-link :to="'/my-registration'">my registration</router-link>.
        </p>
        
        <div v-else-if="$store.state.isLoggedIn && !isCreatingRegistration">
          <p>Registration is open!</p>

          <button @click="isCreatingRegistration = true" class="big-button margin-top-10">
            Create registration
          </button>
        </div>
      </div>
    </div>

    <!-- SINGLE DAY TICKETS -->
    <div class="margin-top-20" v-if="!isCreatingRegistration && !isOrderingSingleDayTicket">
      <div v-if="!isSingleDayTicketSaleOpen">
        Single day ticket sale is not open. See <router-link :to="'/info'">info</router-link> for info.
      </div>
      <div v-else-if="$store.getters.hasRegistration">
        You cannot buy single day tickets as long as you have a registration.
      </div>
      <div v-else-if="isSingleDayTicketSaleOpen && !$store.state.isLoggedIn">
        <p>Single day ticket sale is open! You must <router-link :to="'/login'">log in</router-link> or <router-link :to="'/signup'">create a user</router-link> to purchase.</p>
      </div>
      <div v-else-if="isSingleDayTicketSaleOpen">
        <p>Single day ticket sale is open!</p>
        <button @click="isOrderingSingleDayTicket = true" class="big-button margin-top-10">
          Buy single day tickets
        </button>
      </div>
    </div>

    <!-- CREATING REGISTRATION -->
    <div v-if="isCreatingRegistration && !isOrderingSingleDayTicket" class="margin-bottom-20">
      <h2 class="no-margin-top">
        Create registration
      </h2>
      <div v-if="isCreatingRegistration" id="createRegistrationWrapper">
        <div class="margin-top-4 room-pref-picker" style="text-align: left;">
          <p class="margin-bottom-10">Choose your desired ticket type:</p>

          <div class="room-pref-option no-margin-top" 
              :class="{'selected-option': roomPreference=='insideonly'}"
              @click="selectRoomPreference('insideonly')">
            <label for="roomPreferenceRadioInside">Inside only</label>
            <p class="room-pref-description">Either I sleep inside or I won't attend</p>
          </div>

          <div class="room-pref-option" 
              :class="{'selected-option': roomPreference=='insidepreference'}"
              @click="selectRoomPreference('insidepreference')">
            <label for="roomPreferenceRadioPreference">Inside preference</label> 
            <p class="room-pref-description">If I don't get a spot inside, I'll take an outside slot if available</p>
          </div>

          <div class="room-pref-option" 
              :class="{'selected-option': roomPreference=='outsideonly'}"
              @click="selectRoomPreference('outsideonly')">
            <label for="roomPreferenceRadioOutside">Outside only</label>
            <p class="room-pref-description">Either I sleep outside, or I won't attend</p>
          </div>
        </div>

        <div class="margin-top-10">
          <button @click="cancelRegistration" class="big-button" style="margin-right: 4px;">
            Cancel
          </button>
          <button @click="submitRegistration" :class="{'disabled-button': !roomPreference}" class="big-button theme-button" style="margin-left: 4px;">
            Submit registration
          </button>
        </div>
      </div>
    </div>

    <!-- BUYING SINGLE DAY TICKET -->
    <div v-if="isOrderingSingleDayTicket && !isCreatingRegistration" class="margin-bottom-20">
      <h2 class="no-margin-top">
        Buy single day tickets
      </h2>

        <div class="margin-top-4 room-pref-picker" style="text-align: left; width: fit-content; margin-left: auto; margin-right: auto;">
          <p class="margin-bottom-10">Choose all your desired tickets:</p>

          <div class="room-pref-option no-margin-top" 
              :class="{'selected-option': singleDayTickets.friday===true}"
              @click="toggleTicket('friday')">
            <label for="roomPreferenceRadioInside">Friday</label>
            <p class="room-pref-description">{{singleDayTicketSpotsLeft.friday}} left</p>
          </div>

          <div class="room-pref-option" 
              :class="{'selected-option': singleDayTickets.saturday===true}"
              @click="toggleTicket('saturday')">
            <label for="roomPreferenceRadioPreference">Saturday</label> 
            <p class="room-pref-description">{{singleDayTicketSpotsLeft.saturday}} left</p>
          </div>

          <div class="room-pref-option" 
              :class="{'selected-option': singleDayTickets.sunday===true}"
              @click="toggleTicket('sunday')">
            <label for="roomPreferenceRadioOutside">Sunday</label>
            <p class="room-pref-description">{{singleDayTicketSpotsLeft.sunday}} left</p>
          </div>
        </div>

      <div class="margin-top-10" v-if="!isLoading && !responseMessage">
        <button @click="cancelSingleDayTickets" class="big-button" style="margin-right: 4px;">
          Cancel
        </button>
        <button @click="submitSingleDayTickets" :class="{'disabled-button': !isAnyDaySelected}" class="big-button theme-button" style="margin-left: 4px;">
          Submit
        </button>
      </div>
      <LoadingMessage :message="'Registering tickets...'" v-if="isLoading"/>
    </div>


    <!-- IMAGE AND INFO -->
    <img src="../assets/capri1.png" class="in-text-image-smaller margin-top-20"/>
    <label class="artwork-credit">
      Artwork by <a href="https://orbz41.wixsite.com/catbean">Jadepusen</a>
    </label>

    <div class="full-width-text-container left-aligned-text">
      <h3 class="no-margin-top">Registration information</h3>
      <p>
        This year the registration system is vastly different from earlier. There are three main steps to completing a registration:
      </p>

      <h4>
        1: Creating a user
      </h4>
      <p>
        This can be done at any time as soon as the user system is up and running. To ensure the highest probability of receiving your desired spot, this should be done before the registration opens.
      </p>

      <h4>
        2: Registering
      </h4>
      <p>
        This can be done as soon as registration opens - or even sooner for volunteers. When creating a registration, you will only submit your desired ticket type - inside only, outside only, or inside preference. More information regarding the three room preferences of tickets can be found below.
      </p>

      <p>
        After your registration has been submitted, admins have to manually approve it. When approved, you will have access to step 3.
      </p>

      <h4>
        2.5: Waiting list
      </h4>
      <p>
        If all spots of your desired types are full (inside, outside), you will be placed in a waiting list. You can view your own waiting list number if you're in a list.
      </p>

      <h4>
        3: Adding add-ons and paying
      </h4>      
      <p>
        Once you have received a spot either inside or outside you may purchase add-ons such as early arrival, late departure, and merch. At this point you must also pay for your ticket. Payment will most likely be available via Vipps for Norwegian attendees, or via credit card for anyone. There will be a final payment date, and if you have not paid within this date, you will lose your spot.
      </p>

      <h3 style="margin-top: 40px;">Ticket types</h3>
      <h4 class="no-margin-top">Inside only</h4>
      <p>
        If you register in time to receive a spot immediately, you will be given an inside spot. Otherwise you will be put in the waiting list for inside spots.
      </p>
      
      <h4>Outside only</h4>
      <p>
        If you register in time to receive a spot immediately, you will be given an outside spot. Otherwise you will be put in the waiting list for outside spots.
      </p>
      
      <h4>Inside preference</h4>
      <p>
        - You will be given an inside spot as soon as one is available. If there are available spots inside immediately, you will receive an inside spot.
      </p>
      <p class="small-margin-top">
        - If there are only outside spots available, you will receive an outside spot, and will be put in the waiting list for inside spots. If an inside spot becomes available, you will automatically be given this spot instead.
      </p>
      <p class="small-margin-top">
        - If there are no spots available, you will be put in <b>two</b> waiting lists: both for inside spots and outside spots. If an outside spot becomes available first, you will be given this spot, and remain in the waiting list for inside spots. If at any point an inside spot becomes available, you will be given this spot.
      </p>

      <h3 style="margin-top: 40px;">
        Other information
      </h3>
      <p>
        Some time before the con starts, but after registration, you'll be able to fill in your desired room sharing partners if you have received an inside spot.
      </p>
      <p style="margin-top: 26px;">
        Should you decide to change your ticket type <i>after</i> it has been approved, you will be put at the back of any waiting lists, if they exist. This rule does not apply for changing from <b>inside preference</b> to either of the other types - in that case, you will keep your spot or waiting list number for the ticket type you change to.
      </p>
      <p style="margin-top: 26px;">
        Payments will not be refunded, more info in the <router-link :to="'/legal'">terms and conditions</router-link>.
      </p>
    </div>
  </div>
</template>

<script>
import registrationApi from '@/api/registration-api'
import singleDayTicketRegistrationApi from '@/api/single-day-ticket-registration-api'

import ResponseMessage from '../components/ResponseMessage.vue'
import LoadingMessage from '../components/LoadingMessage.vue'

export default {
  name: 'register',

  components: { ResponseMessage, LoadingMessage, },

  data: function () {
    return {
      roomPreference: undefined,
      errorMessage: '',
      isCreatingRegistration: false,
      isOrderingSingleDayTicket: false,
      singleDayTickets: {
        'friday': false,
        'saturday': false,
        'sunday': false,
      },
      singleDayTicketSpotsLeft: {
        'friday': 0,
        'saturday': 0,
        'sunday': 0,
      },
      responseMessage: '',
      messageType: 'error',
      isLoading: false,
    }
  },

  computed: {
    isRegistrationOpen () {
      let now = new Date()

      if (!this.$store.getters.isLoggedIn === true) {
        return now > new Date(this.$store.getters.conInfo.registrationOpenDate)
      }
      else {
        if (this.$store.getters.userData.isVolunteer === true) {
          return now > new Date(this.$store.getters.conInfo.volunteerRegistrationOpenDate)
        }
        else {
          return now > new Date(this.$store.getters.conInfo.registrationOpenDate)
        }
      }
    },

    isRegistrationClosed () {
      let now = new Date()
      return now > new Date(this.$store.getters.conInfo.registrationCloseDate)
    },

    isSingleDayTicketSaleOpen () {
      let now = new Date()
      return now > new Date(this.$store.getters.conInfo.singleDayTicketSaleOpenDate)
        && now < new Date(this.$store.getters.conInfo.singleDayTicketSaleCloseDate)
    },

    timeUntilRegistrationString () {
      if (this.isRegistrationOpen) { return 0 }

      let remainingSeconds = (new Date(this.$store.getters.conInfo.registrationOpenDate) - new Date ())/1000
      let remainingDays = Math.floor(remainingSeconds/(86400))
      let remainingHours = Math.floor((remainingSeconds-remainingDays*86400)/3600)
      let remainingMinutes = Math.ceil((remainingSeconds-remainingDays*86400-remainingHours*3600)/60)
      return `${remainingDays} days, ${remainingHours} hours, ${remainingMinutes} minutes`
    },

    isAnyDaySelected () {
      return Object.keys(this.singleDayTickets).filter(day => this.singleDayTickets[day] === true).length > 0
    }
  },

  methods: {
    selectRoomPreference (pref) {
      this.roomPreference = pref
    },
    
    async submitRegistration () {
      this.isLoading = true
      let result = await registrationApi.submitRegistration(this.$store.state.userData.id, {roomPreference: this.roomPreference})
      this.isLoading = false

      if ('error' in result) {
        this.responseMessage = result.error
        this.messageType = 'error'
        this.isLoading = false
      }
      else {
        this.$store.dispatch('refreshUserData')
        this.$router.push('my-registration')
      }
    },

    cancelRegistration () {
      this.isCreatingRegistration = false
      this.roomPreference = undefined
      this.responseMessage = ''
    },

    async submitSingleDayTickets () {
      if (!this.isAnyDaySelected) { return }

      this.isLoading = true
      let result = await singleDayTicketRegistrationApi.submitSingleDayTicketRegistration(this.$store.state.userData.id, {days: this.singleDayTickets})
      this.isLoading = false

      if ('error' in result) {
        this.responseMessage = result.error
        this.messageType = 'error'
        this.isLoading = false
      }
      else {
        if ('message' in result) {
          this.responseMessage = result.message
          this.messageType = 'info'
          this.$store.dispatch('refreshUserData')
        }
        else {
          this.$store.dispatch('refreshUserData')
          this.$router.push('my-registration')
        }
      }
    },

    cancelSingleDayTickets () {
      this.isOrderingSingleDayTicket = false
    },

    toggleTicket (day) {
      if (this.singleDayTicketSpotsLeft[day] > 0) {
        this.singleDayTickets[day] = !this.singleDayTickets[day]
      }
    },

    closeResponseMessage () {
      this.responseMessage = ''
    }
  },

  async mounted () {
    this.singleDayTicketSpotsLeft = await singleDayTicketRegistrationApi.getRegistrationSpotsLeft()
  }
}
</script>

<style lang="scss">
.room-pref-picker {
  max-width: 90vw;

  p:not(:first-child) {
    font-size: 13px;
    font-style: italic;
    margin-top: 0px;
  }

  label {
    font-weight: 600;
  }

  .room-pref-option {
    border: 3px solid #ddd;
    margin-top: 10px;
    padding: 8px 12px;
    box-sizing: border-box;

    &:hover {
        cursor: pointer;
    }

    &.hide-cursor-pointer {
      &:hover {
        cursor: default;
      }
    }

    &.selected-option {
      background-color: #dafff1;
      // color: white;
      border-color: #35b886;
      border-width: 3px;
    }
  }
}

.registration-countdown {
  p:first-child {
    font-size: 20px;
    font-weight: 600;
  }
  margin: 20px;
}

#createRegistrationWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

<style lang="scss" scoped>
h4 {
  margin-top: 16px;
}
h3 {
  margin-top: 0px;
}
.small-margin-top {
  margin-top: 14px;
}
</style>