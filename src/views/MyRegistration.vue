<template>
  <div class="flex-col">
    <h1>My Registration</h1>
{{this.myRegistration}}
    <div v-if="registrationStatus == 'unapproved'" class="flex-col">
      <div style="border: 1px solid black; padding: 5px;">
        Your registration is not approved yet. You can only change ticket type, and doing so will not put you further back in the queue.
      </div>

      <h3>Ticket type</h3>
      <span><input type="radio" v-model="newRegistration.roomPreference" value="insideonly"/> Inside only</span>
      <span><input type="radio" v-model="newRegistration.roomPreference" value="insidepreference"/> Inside preference</span>
      <span><input type="radio" v-model="newRegistration.roomPreference" value="outsideonly"/> Outside only</span>

      <button @click="updateRegistration" v-show="canSave">
        Update registration
      </button>

      <p style="color: red" v-show="errorMessage">Error: {{errorMessage}}</p>
    </div>

    <div v-else-if="registrationStatus == 'approved'" class="flex-col">
      <h3>Ticket type</h3>
      <p>Note: Bla bla endre fra x til y medfører bakerst i køen, med mindre det er fra inside-preference til en av de andre.</p>
      <span><input type="radio" v-model="newRegistration.roomPreference" value="insideonly"/> Inside only</span>
      <span><input type="radio" v-model="newRegistration.roomPreference" value="insidepreference"/> Inside preference</span>
      <span><input type="radio" v-model="newRegistration.roomPreference" value="outsideonly"/> Outside only</span>

      <h3>Add-ons</h3>
      <p v-if="isAddonsDeadlinePassed">DEADLINE PASSED! Kan ikke legge til eller fjerne.</p>
      <!-- EARLY OG LATE -->
      <span>
        <input type="checkbox" v-model="newRegistration.earlyArrival" :disabled="isAddonsDeadlinePassed && !myRegistration.isEarlyArrivalPaid"/>
        Early arrival ({{conInfo.earlyArrivalPriceNok}} kr)
      </span>
      <span>
        <input type="checkbox" v-model="newRegistration.lateDeparture"  :disabled="isAddonsDeadlinePassed && !myRegistration.isLateDeparturePaid"/>
        Late departure ({{conInfo.lateDeparturePriceNok}} kr)
      </span>
      <br>

      <!-- HOODIE OG T-SKJORTE -->
      <span v-if="$store.state.conInfo.isSellingHoodies">
        <input type="checkbox" v-model="newRegistration.buyHoodie" @change="possibleResetHoodieSize" :disabled="isAddonsDeadlinePassed && !myRegistration.isHoodiePaid"/> 
        Buy hoodie ({{conInfo.hoodiePriceNok}} kr)
        <select v-model="newRegistration.hoodieSize" v-show="newRegistration.buyHoodie">
          <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
        </select>
      </span>
      <span v-if="$store.state.conInfo.isSellingTshirts">
        <input type="checkbox" v-model="newRegistration.buyTshirt" @change="possibleResetTshirtSize" :disabled="isAddonsDeadlinePassed && !myRegistration.isTshirtPaid"/> 
        Buy t-shirt ({{conInfo.tshirtPriceNok}} kr)
        <select v-model="newRegistration.tshirtSize" v-show="newRegistration.buyTshirt">
          <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
        </select>
      </span>

      <button @click="updateRegistration" v-show="canSave">
        Update registration
      </button>

      <p style="color: red" v-show="errorMessage">Error: {{errorMessage}}</p>
    </div>

    <div v-else>
      No registration / not logged in. This route won't be available in final version unless user actually has one & is logged in.
    </div>

  </div>
</template>

<script>
import registrationApi from '../api/registration-api'
import { mapGetters } from 'vuex'

export default {
  name: 'myRegistration',

  data: function () {
    return {
      errorMessage: '',
      newRegistration: null,
      sizes: ['S','M','L','XL','XXL'],
      isAddonsDeadlinePassed: false,
    }
  },

  computed: {
    ...mapGetters(['myRegistration', 'conInfo']),

    canSave () {
      console.log(Object.keys(this.newRegistration).filter(key => this.newRegistration[key] !== this.myRegistration[key]).map(k => [k, this.newRegistration[k], this.myRegistration[k]]))
      return Object.keys(this.newRegistration).some(key => this.newRegistration[key] !== this.myRegistration[key])
    },

    registrationStatus () {
      if (!this.$store.state.isLoggedIn || !this.$store.state.userData.registrationId || !this.myRegistration || !this.newRegistration) {
        return 'none'
      }
      else if (this.myRegistration.isAdminApproved) {
        return 'approved'
      }
      else {
        return 'unapproved'
      }
    }
  },

  methods: {
    possibleResetHoodieSize (changeEvent) {
      if (!changeEvent.target.checked) {
        this.newRegistration.hoodieSize = null
      }
    },
    
    possibleResetTshirtSize (changeEvent) {
      if (!changeEvent.target.checked) {
        this.newRegistration.tshirtSize = null
      }
    },

    async updateRegistration () {
      let result = await registrationApi.updateRegistration(this.$store.state.userData.id, this.newRegistration)

      if (result.success) {
        this.errorMessage = 'Update successful'
        this.getRegistration()
      }
      else {
        this.errorMessage = result.error
      }
    },

    async getRegistration () {
      await this.$store.dispatch('getMyRegistration')
      this.newRegistration = {...this.myRegistration}
    },

    async calculateDeadlines () {
      this.isAddonsDeadlinePassed = new Date() > new Date(this.conInfo.addonPaymentDeadline)
    }
  },

  async mounted () {
    this.getRegistration()
    this.calculateDeadlines()
  },

  destroyed () {
  }
}
</script>
