<template>
  <div class="flex-col limit-full-width">
    <h1>My Registration</h1>
    
    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" :scrollToTop="true" @closeMessage="closeResponseMessage" v-if="responseMessage"/>

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
        <span class="margin-top-4">
          <input type="radio" v-model="newRegistration.roomPreference" value="insidepreference" id="roomPreferenceInsidePreference"/>
          <label for="roomPreferenceInsidePreference">Inside preference</label>          
        </span>
        <span class="margin-top-4">
          <input type="radio" v-model="newRegistration.roomPreference" value="outsideonly" id="roomPreferenceOutside"/>
          <label for="roomPreferenceOutside">Outside only</label>          
        </span>
      </div>

      <p v-show="canSaveRoomPreference" class="margin-top-10 margin-bottom-10 warning-text">
        REMINDER: Updating your registration now will put you at the back of any queues!
      </p>

      <div>
        <button @click="cancelEditing" v-show="canSaveRoomPreference" class="big-button neutral-button">
          <CancelIcon/> Cancel
        </button>
        <button @click="updateRegistration" v-show="canSaveRoomPreference" class="big-button danger-button margin-left-10">
          <SaveIcon/> Update ticket type
        </button>
      </div>
    </div>


    <!-- APPROVED REGISTRATION -->
    <div v-else-if="registrationStatus == 'approved'" class="flex-col">
      <h3 class="margin-top-10">Status</h3>
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

      <h3>Ticket type</h3>
      <p class="margin-bottom-10">
        If you change your ticket type to one of the other options below you <u>will</u> lose your spot and be put at the back of any waiting list.
      </p>
      <div class="flex-col left-align-content">
        <span>
          <input type="radio" v-model="newRegistration.roomPreference" value="insideonly" id="roomPreferenceinsideonly"/>
          <label for="roomPreferenceinsideonly">Inside only</label>
        </span>
        <span class="margin-top-4">
          <input type="radio" v-model="newRegistration.roomPreference" value="insidepreference" id="roomPreferenceinsidepreference"/>
          <label for="roomPreferenceinsidepreference">Inside preference</label>
        </span>
        <span class="margin-top-4">
          <input type="radio" v-model="newRegistration.roomPreference" value="outsideonly" id="roomPreferenceoutsideonly"/>
          <label for="roomPreferenceoutsideonly">Outside only</label>
        </span>
      </div>

      <p v-show="canSaveRoomPreference" class="margin-top-10 margin-bottom-10 warning-text">
        REMINDER: Updating your ticket type will make you lose your spot, and put you at the back of any waiting list!
      </p>

      <div v-show="canSaveRoomPreference">
        <button @click="cancelEditing" class="big-button neutral-button">
          <CancelIcon/> Cancel
        </button>
        <button @click="updateRegistration" class="big-button danger-button margin-left-10">
          <SaveIcon/> Update ticket type
        </button>
      </div>

      <div v-show="!canSaveRoomPreference" class="flex-col">
        <h3>Add-ons</h3>
        <p class="margin-bottom-10">
          You can add and remove add-ons without your spot being affected. Once you pay for an add-on, you cannot remove it and it will not be refunded.
        </p>
        <p v-if="isAddonsDeadlinePassed">DEADLINE PASSED! Kan ikke legge til eller fjerne.</p>
        <!-- EARLY OG LATE -->
        <div class="flex-col left-align-content">
          <span>
            <input type="checkbox" v-model="newRegistration.earlyArrival" :disabled="isAddonsDeadlinePassed && !myRegistration.isEarlyArrivalPaid" id="updateRegearlyArrival"/>
            <label for="updateRegearlyArrival">Early arrival ({{conInfo.earlyArrivalPriceNok}} kr)</label>
          </span>
          <span>
            <input type="checkbox" v-model="newRegistration.lateDeparture"  :disabled="isAddonsDeadlinePassed && !myRegistration.isLateDeparturePaid" id="updateReglateDeparture"/>
            <label for="updateReglateDeparture">Late departure ({{conInfo.lateDeparturePriceNok}} kr)</label>
          </span>

        </div>
        <br>

        <!-- HOODIE OG T-SKJORTE -->
        <div class="flex-col left-align-content">
          <span v-if="$store.state.conInfo.isSellingHoodies">
            <input type="checkbox" v-model="newRegistration.buyHoodie" @change="possibleResetHoodieSize" :disabled="isAddonsDeadlinePassed && !myRegistration.isHoodiePaid" id="newRegistrationbuyHoodie"/>
            <label for="newRegistrationbuyHoodie">Buy hoodie ({{conInfo.hoodiePriceNok}} kr)</label>
            <select v-model="newRegistration.hoodieSize" v-show="newRegistration.buyHoodie" class="margin-left-10">
              <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
            </select>
          </span>
          <span v-if="$store.state.conInfo.isSellingTshirts">
            <input type="checkbox" v-model="newRegistration.buyTshirt" @change="possibleResetTshirtSize" :disabled="isAddonsDeadlinePassed && !myRegistration.isTshirtPaid" id="newRegistrationbuyTshirt"/>
            <label for="newRegistrationbuyTshirt">Buy t-shirt ({{conInfo.tshirtPriceNok}} kr)</label>
            <select v-model="newRegistration.tshirtSize" v-show="newRegistration.buyTshirt" class="margin-left-10">
              <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
            </select>
          </span>
        </div>

        <div v-show="canSaveAddons" class="margin-top-10">
          <button @click="cancelEditing" class="big-button neutral-button">
            <CancelIcon/> Cancel
          </button>
          <button @click="updateRegistration" class="big-button theme-button margin-left-10">
            <SaveIcon/> Update add-ons
          </button>
        </div>
      </div>

      <!-- PAYMENT -->
      <div v-show="!canSaveRoomPreference">
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
            <td>{{formatBoolean(myRegistration.receivedInsideSpot===true ? myRegistration.isMainDaysInsidePaid : myRegistration.isMainDaysOutsidePaid)}}</td>
            <td>{{myRegistration.receivedInsideSpot===true ? conInfo.mainDaysInsidePriceNok : conInfo.mainDaysOutsidePriceNok}}</td>
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
    </div>

    <!-- NO REGISTRATION -->
    <div v-else>
      No registration / not logged in. This route won't be available in final version unless user actually has one & is logged in.
    </div>

  </div>
</template>

<script>
import registrationApi from '../api/registration-api'
import ResponseMessage from '../components/ResponseMessage.vue'

import SaveIcon from 'vue-material-design-icons/ContentSave.vue'
import CancelIcon from 'vue-material-design-icons/Close.vue'

import { mapGetters } from 'vuex'
import { formatBoolean, sleepMillisec } from '../utils'

export default {
  name: 'myRegistration',

  components: {
    ResponseMessage,
    SaveIcon, CancelIcon,
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

    canSaveAddons () {
      return Object.keys(this.newRegistration).some(key => (key !== 'roomPreference') && (this.newRegistration[key] !== this.myRegistration[key]))
    },

    canSaveRoomPreference () {
      return this.newRegistration['roomPreference'] !== this.myRegistration['roomPreference']
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
      let result
      if (this.canSaveRoomPreference === true) {
        result = await this.updateRoomPreference(this.$store.state.userData.id, this.newRegistration.roomPreference)
      }
      else {
        result = await registrationApi.updateRegistration(this.$store.state.userData.id, this.newRegistration)
      }

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

    async updateRoomPreference (userId, newRoomPreference) {
      let registrationDataToSend = {...this.myRegistration}
      registrationDataToSend.roomPreference = newRoomPreference
      
      return await registrationApi.updateRegistration(userId, registrationDataToSend)
    },

    async getRegistration () {
      if (!this.$store.getters.isLoggedIn) {
        this.setupLoginListener()
        return
      }

      await this.$store.dispatch('getMyRegistration')

      this.newRegistration = {...this.myRegistration}
    },

    cancelEditing () {
      this.newRegistration = {...this.myRegistration}
    },

    closeResponseMessage () {
      this.responseMessage = ''
    },

    async calculateDeadlines () {
      this.isAddonsDeadlinePassed = new Date() > new Date(this.conInfo.addonPaymentDeadline)
    },

    setupLoginListener () {
      this.$store.watch(() => this.$store.getters.isLoggedIn, () => {
        if (this.myRegistration === null || this.myRegistration === undefined) {
          this.getRegistration()
        }
      })
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