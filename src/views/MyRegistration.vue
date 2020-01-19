<template>
  <div class="flex-col limit-full-width">
    <h1>My Registration</h1>

    <!-- NOT APPROVED REGISTRATION -->
    <div v-if="registrationStatus == 'unapproved'" class="flex-col">
      <div style="border: 1px solid black; padding: 5px;">
        Your registration is not approved yet. You can only change your ticket type, and doing so <u>will</u> put you at the back of any existing queues.
      </div>

      <h3>Ticket type</h3>
      <div class="flex-col left-align-content">
        <span>
          <input type="radio" v-model="newRegistration.roomPreference" value="insideonly" id="roomPreferenceInside"/>
          <label for="roomPreferenceInside">Inside only</label>          
        </span>
        <span>
          <input type="radio" v-model="newRegistration.roomPreference" value="insidepreference" id="roomPreferenceInsidePreference"/>
          <label for="roomPreferenceInsidePreference">Inside preference</label>          
        </span>
        <span>
          <input type="radio" v-model="newRegistration.roomPreference" value="outsideonly" id="roomPreferenceOutside"/>
          <label for="roomPreferenceOutside">Outside only</label>          
        </span>
      </div>

      <button @click="updateRegistration" v-show="canSave">
        Update registration
      </button>
    </div>

    <!-- APPROVED REGISTRATION -->
    <div v-else-if="registrationStatus == 'approved'" class="flex-col">
      <h3>Status</h3>
      <div style="border: 1px solid black; padding: 5px;">
        <p v-if="!myRegistration.receivedInsideSpot && !myRegistration.receivedOutsideSpot">
          Your registration is approved, but you have not received a spot yet.
          <span v-if="myRegistration.roomPreference === 'insideonly' || 'insidepreference'">
            Your waiting list position for an <i>inside</i> room: {{myRegistration.waitingListPositions.inside}}
          </span>
          <br>
          <span v-if="myRegistration.roomPreference === 'insideonly' || 'insidepreference'">
            Your waiting list position for an <i>outside</i> room: {{myRegistration.waitingListPositions.outside}}
          </span>
        </p>

        <p v-else-if="myRegistration.receivedOutsideSpot && myRegistration.roomPreference === 'insidepreference'">
          Your registration is approved, and you have received a spot outside! <br/>
          You are in the waiting list for a room inside, position number {{myRegistration.waitingListPositions.inside}}
        </p>

        <p v-else-if="myRegistration.receivedInsideSpot && myRegistration.roomPreference === 'insidepreference'">
          Your registration is approved, and you have received a spot inside! <br/>
          You will not receive a spot outside, because your ticket type is Inside Preference.
        </p>

        <p v-else>
          Your registration is approved, and you have received a spot {{myRegistration.receivedInsideSpot ? 'inside' : 'outside'}}!
        </p>
      </div>

      <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage" v-if="responseMessage"/>

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

      <!-- PAYMENT -->
      <h3>Payments</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Is paid</th>
            <th>Price</th>
          </tr>
        </thead>
        <tr>
          <td>Main days paid</td>
          <td>{{formatBoolean(myRegistration.isMainDaysInsidePaid)}}</td>
          <td>{{conInfo.mainDaysPriceNok}}</td>
        </tr>

        <tr v-if="myRegistration.earlyArrival">
          <td>Early arrival paid</td>
          <td>{{formatBoolean(myRegistration.isEarlyArrivalPaid)}}</td>
          <td>{{conInfo.earlyArrivalPriceNok}}</td>
        </tr>

        <tr v-if="myRegistration.lateDeparture">
          <td>Late departure paid</td>
          <td>{{formatBoolean(myRegistration.isLateDeparturePaid)}}</td>
          <td>{{conInfo.lateDeparturePriceNok}}</td>
        </tr>

        <tr v-if="myRegistration.buyTshirt">
          <td>T-shirt paid</td>
          <td>{{formatBoolean(myRegistration.isTshirtPaid)}}</td>
          <td>{{conInfo.tshirtPriceNok}}</td>
        </tr>

        <tr v-if="myRegistration.buyHoodie">
          <td>Hoodie paid</td>
          <td>{{formatBoolean(myRegistration.isHoodiePaid)}}</td>
          <td>{{conInfo.hoodiePriceNok}}</td>
        </tr>

        <thead>
          <tr>
            <th colspan="3"></th>
          </tr>
        </thead>

        <tr>
          <td>Total paid amount</td>
          <td colspan="2">{{myRegistration.paidAmount}}</td>
        </tr>

        <tr>
          <td>Total amount to be paid</td>
          <td colspan="2">{{myRegistration.unpaidAmount}}</td>
        </tr>
      </table>
    </div>

    <div v-else>
      No registration / not logged in. This route won't be available in final version unless user actually has one & is logged in.
    </div>

  </div>
</template>

<script>
import registrationApi from '../api/registration-api'
import ResponseMessage from '../components/ResponseMessage.vue'
import { mapGetters } from 'vuex'
import { formatBoolean } from '../utils'

export default {
  name: 'myRegistration',

  components: {
    ResponseMessage
  },

  data: function () {
    return {
      responseMessage: '',
      responseMessageType: 'error',
      newRegistration: null,
      sizes: ['S','M','L','XL','XXL'],
      isAddonsDeadlinePassed: false,
    }
  },

  computed: {
    ...mapGetters(['myRegistration', 'conInfo']),

    canSave () {
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
        this.responseMessage = 'Update successful'
        this.responseMessageType = 'success'
        this.getRegistration()
      }
      else {
        this.responseMessage = result.error
        this.responseMessageType = 'error'
      }
    },

    async getRegistration () {
      await this.$store.dispatch('getMyRegistration')
      this.newRegistration = {...this.myRegistration}
    },

    closeResponseMessage () {
      this.responseMessage = ''
    },

    async calculateDeadlines () {
      this.isAddonsDeadlinePassed = new Date() > new Date(this.conInfo.addonPaymentDeadline)
    },

    formatBoolean,
  },

  async mounted () {
    this.getRegistration()
    this.calculateDeadlines()
  },

  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin-top: 20px;
}
</style>