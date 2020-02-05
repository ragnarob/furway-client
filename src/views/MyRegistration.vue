<template>
  <div class="flex-col limit-full-width">
    <h1>My Registration</h1>
    
    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" :scrollToTop="true" @closeMessage="closeResponseMessage" v-if="responseMessage"/>

    <LoadingMessage :message="'Loading registration...'" v-if="isLoadingRegistration"/>

    <!-- NOT APPROVED REGISTRATION -->
    <div v-else-if="registrationStatus == 'unapproved'" class="flex-col">
      <div class="shadow-box">
        <p>
          Your registration is not approved yet. You will have more options as soon as an admin has approved it.
        </p>
        <p class="margin-top-10">
          You <i>can</i> change your ticket type, but doing so <u>will</u> put you at the back of any existing queues.
        </p>
        <p class="margin-top-10">
          Your registration was submitted {{formatDatetimeWithoutYear(myRegistration.timestamp)}}.
        </p>
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

      <p v-show="isEditingUnapprovedRoomPreference" class="margin-top-10 margin-bottom-10 warning-text">
        REMINDER: Updating your registration now will put you at the back of any queues!
      </p>

      <div>
        <button @click="cancelEditing" v-show="isEditingUnapprovedRoomPreference" class="big-button neutral-button double-button">
          <CancelIcon title=""/>Cancel
        </button>
        <button @click="updateRegistration" v-show="isEditingUnapprovedRoomPreference" class="big-button danger-button double-button margin-left-10">
          <SaveIcon title/>Update ticket type
        </button>
      </div>
    </div>


    <!-- APPROVED REGISTRATION -->
    <div v-else-if="registrationStatus == 'approved'" class="flex-col">
      <div class="shadow-box">
        <span v-if="!myRegistration.receivedInsideSpot && !myRegistration.receivedOutsideSpot">
          <p >
            Your registration is approved, but you have not received a spot yet.
          </p>

          <p v-if="myRegistration.roomPreference === 'insideonly' || myRegistration.roomPreference === 'insidepreference'" class="margin-top-10">
            Your waiting list position for an <i>inside</i> room: <b>{{myRegistration.waitingListPositions.inside}}</b>
          </p>

          <p v-if="myRegistration.roomPreference === 'outsideonly' || myRegistration.roomPreference === 'insidepreference'" class="margin-top-10">
            Your waiting list position for an <i>outside</i> spot: <b>{{myRegistration.waitingListPositions.outside}}</b>
          </p>
        </span>

        <span v-else-if="myRegistration.receivedOutsideSpot && myRegistration.roomPreference === 'insidepreference'">
          <p>
            Your registration is approved, and you have received a spot outside!
          </p>

          <p class="margin-top-10">
            Your waiting list position for an <i>inside</i> room: <b>{{myRegistration.waitingListPositions.inside}}</b>
          </p>
        </span>

        <span v-else-if="myRegistration.receivedInsideSpot && myRegistration.roomPreference === 'insidepreference'">
          <p>
            Your registration is approved, and you have received a spot inside!
          </p>
          <p class="margin-top-10">
            You will not receive a spot outside, because your ticket type is Inside Preference.
          </p>
        </span>

        <p v-else>
          Your registration is approved, and you have received a spot {{myRegistration.receivedInsideSpot ? 'inside' : 'outside'}}!
        </p>

        <p class="margin-top-10">
          Your registration was approved {{formatDatetimeWithoutYear(myRegistration.timestamp)}}.
        </p>
        <p>
          Your registration number is: <b>{{myRegistration.registrationNumber}}</b>
        </p>
      </div>

      <h3>Ticket type</h3>
      <p v-if="canChangeRoomPrefWithoutReset || canChangeRoomPreferenceWithPartialReset">
        You can change your ticket type while keeping one of your spots / waiting list positions. Click the button below to see more details.
      </p>
      <p v-else>
        If you change your ticket type to one of the other options below you <u>will</u> lose your spot and be put at the back of any waiting list.
      </p>

      <div class="flex-col left-align-content margin-top-10">
        <span>
          <input type="radio" v-model="newRegistration.roomPreference" value="insideonly" :disabled="!isEditingRoomPreference" id="roomPreferenceinsideonly"/>
          <label for="roomPreferenceinsideonly">Inside only</label>
        </span>
        <span class="margin-top-4">
          <input type="radio" v-model="newRegistration.roomPreference" value="insidepreference" :disabled="!isEditingRoomPreference" id="roomPreferenceinsidepreference"/>
          <label for="roomPreferenceinsidepreference">Inside preference</label>
        </span>
        <span class="margin-top-4">
          <input type="radio" v-model="newRegistration.roomPreference" value="outsideonly" :disabled="!isEditingRoomPreference" id="roomPreferenceoutsideonly"/>
          <label for="roomPreferenceoutsideonly">Outside only</label>
        </span>
      </div>

      <button @click="isEditingRoomPreference = true" v-show="!isEditingRoomPreference" class="margin-top-10">
        Change ticket type
      </button>

      <div v-show="isEditingRoomPreference" class="margin-top-10">
        <p v-if="canChangeRoomPrefWithoutReset" class="warning-text">
          Changing your ticket type from 'Inside Preference' to anything else will make you lose your position in one of the waiting lists. Your position in the waiting list of your new desired room type <u>will stay the same</u>.
        </p>

        <span v-else-if="canChangeRoomPreferenceWithPartialReset" class="warning-text">
          <p>
            If you change your ticket type to 'Outside Only' you will <u>keep your outside spot</u>.
          </p>

          <p class="margin-top-10">
            If you change your ticket type to 'Inside Only' you will <u>lose your outside spot</u>, but keep your current position in the inside waiting list.
          </p>
        </span>

        <p v-else class="warning-text">
          REMINDER: Updating your ticket type will make you lose your spot, and put you at the back of any waiting list!
        </p>
      </div>

      <div v-show="isEditingRoomPreference" class="margin-top-10">
        <button @click="cancelEditing" class="big-button neutral-button double-button">
          <CancelIcon title=""/>Cancel
        </button>
        <button @click="updateRegistration" v-show="canSaveRoomPreference" class="big-button danger-button double-button margin-left-10">
          <SaveIcon title=""/>Update ticket type
        </button>
      </div>

      <div v-show="!isEditingRoomPreference" class="flex-col">
        <h3>Add-ons</h3>
        <p class="margin-bottom-10">
          You can add and remove add-ons without your spot being affected. Once you pay for an add-on, you cannot remove it and it will not be refunded.
        </p>
        <p v-if="isAddonsDeadlinePassed">DEADLINE PASSED! Kan ikke legge til eller fjerne.</p>
        <!-- EARLY OG LATE -->
        <div class="flex-col left-align-content">
          <span>
            <input type="checkbox" v-model="newRegistration.earlyArrival" :disabled="isAddonsDeadlinePassed" id="updateRegearlyArrival"/>
            <label for="updateRegearlyArrival">Early arrival ({{conInfo.earlyArrivalPriceNok}} kr)</label>
          </span>
          <span>
            <input type="checkbox" v-model="newRegistration.lateDeparture"  :disabled="isAddonsDeadlinePassed" id="updateReglateDeparture"/>
            <label for="updateReglateDeparture">Late departure ({{conInfo.lateDeparturePriceNok}} kr)</label>
          </span>

        </div>
        <br>

        <!-- HOODIE OG T-SKJORTE -->
        <div class="flex-col left-align-content">
          <span v-if="$store.state.conInfo.isSellingHoodies">
            <input type="checkbox" v-model="newRegistration.buyHoodie" @change="possibleResetHoodieSize" :disabled="isAddonsDeadlinePassed" id="newRegistrationbuyHoodie"/>
            <label for="newRegistrationbuyHoodie">Buy hoodie ({{conInfo.hoodiePriceNok}} kr)</label>
            <select v-model="newRegistration.hoodieSize" v-show="newRegistration.buyHoodie" class="margin-left-10">
              <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
            </select>
          </span>
          <span v-if="$store.state.conInfo.isSellingTshirts">
            <input type="checkbox" v-model="newRegistration.buyTshirt" @change="possibleResetTshirtSize" :disabled="isAddonsDeadlinePassed" id="newRegistrationbuyTshirt"/>
            <label for="newRegistrationbuyTshirt">Buy t-shirt ({{conInfo.tshirtPriceNok}} kr)</label>
            <select v-model="newRegistration.tshirtSize" v-show="newRegistration.buyTshirt" class="margin-left-10">
              <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
            </select>
          </span>
        </div>

        <div v-show="canSaveAddons" class="margin-top-10">
          <button @click="cancelEditing" class="big-button neutral-button double-button">
            <CancelIcon title=""/>Cancel
          </button>
          <button @click="updateRegistration" class="big-button theme-button double-button margin-left-10">
            <SaveIcon title=""/>Update add-ons
          </button>
        </div>
      </div>

      <!-- PAYMENT -->
      <div v-show="!isEditingRoomPreference">
        <h3>Payments</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tr>
            <td>Main days</td>
            <td v-if="myRegistration.roomPreference === 'insideonly' || myRegistration.receivedInsideSpot">
              {{conInfo.mainDaysInsidePriceNok}}
            </td>
            <td v-else-if="myRegistration.roomPreference === 'outsideonly' || myRegistration.receivedOutsideSpot">
              {{conInfo.mainDaysOutsidePriceNok}}
            </td>
            <td v-else>
              {{conInfo.mainDaysInsidePriceNok}} inside, or<br/>
              {{conInfo.mainDaysOutsidePriceNok}} outside
            </td>
          </tr>

          <tr v-if="myRegistration.earlyArrival">
            <td>Early arrival</td>
            <td>{{conInfo.earlyArrivalPriceNok}}</td>
          </tr>

          <tr v-if="myRegistration.lateDeparture">
            <td>Late departure</td>
            <td>{{conInfo.lateDeparturePriceNok}}</td>
          </tr>

          <tr v-if="myRegistration.buyTshirt">
            <td>T-shirt</td>
            <td>{{conInfo.tshirtPriceNok}}</td>
          </tr>

          <tr v-if="myRegistration.buyHoodie">
            <td>Hoodie</td>
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
            <td colspan="2">
              {{myRegistration.totalAmount}}
              <span v-if="isWaitingForBothSpots">
                <br/>
                {{`(+${conInfo.mainDaysInsidePriceNok - conInfo.mainDaysOutsidePriceNok} for inside)`}}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <div v-show="!isEditingRoomPreference" class="flex-col">
        <h3>Delete registration</h3>
        <p>Not going to Furway after all? You may delete your registration, but there is no going back from this!</p>
        <button @click="isDeletingRegistration = true" v-show="!isDeletingRegistration" class="margin-top-10 double-button">
          <DeleteIcon title=""/>Delete my registration
        </button>
        <button @click="cancelDeleting" v-show="isDeletingRegistration" class="margin-top-10 margin-bottom-10 big-button double-button">
          <CancelIcon title=""/>Cancel deleting
        </button>
        
        <div v-if="isDeletingRegistration">
          <p>To confirm the permanent deletion of your registration, please enter your username and then click confirm.</p>

          <div class="margin-top-10 flex-col">
            <input type="text" v-model="deleteRegistrationUsername" style="width: 120px; margin-bottom: 4px;"/>
            <button @click="confirmDeleteRegistration" :class="{'danger-button': true, 'big-button': true, 'disabled-button': !isDeleteUsernameEqual, 'double-button': true}">
              <DeleteIcon title=""/>Delete registration
            </button>
          </div>
        </div>
      </div>
    </div>

  
    <!-- NO REGISTRATION -->
    <div v-else-if="registrationStatus == 'noRegistration'">
      You don't have a registration. You can register <router-link :to="'/register'">here</router-link>.
    </div>


    <!-- REJECTED REGISTRATION -->
    <div v-else-if="registrationStatus == 'rejected'">
      <p>Sorry, your registration has been rejected.</p>
      <p>If you wish to ask for more information regarding this, please send an email to info@furway.no.</p>
    </div>


    <div v-if="registrationStatus == 'notLoggedIn' && !isLoadingRegistration" class="margin-top-10">
      <p>Not logged in.</p> 
      <p class="margin-top-4">
        <router-link :to="'/login'">
          Go to login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import registrationApi from '../api/registration-api'
import ResponseMessage from '../components/ResponseMessage.vue'
import LoadingMessage from '../components/LoadingMessage.vue'

import SaveIcon from 'vue-material-design-icons/ContentSave.vue'
import CancelIcon from 'vue-material-design-icons/Close.vue'
import DeleteIcon from 'vue-material-design-icons/DeleteOutline.vue'

import { mapGetters } from 'vuex'
import { formatBoolean, sleepMillisec } from '../utils'

export default {
  name: 'myRegistration',

  components: {
    ResponseMessage, LoadingMessage,
    SaveIcon, CancelIcon, DeleteIcon
  },

  data: function () {
    return {
      isLoadingRegistration: true,
      isEditingRoomPreference: false,
      isDeletingRegistration: false,
      deleteRegistrationUsername: '',
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

    canChangeRoomPrefWithoutReset () {
      return this.myRegistration 
        && this.myRegistration.roomPreference === 'insidepreference'
        && !this.myRegistration.receivedInsideSpot
        && !this.myRegistration.receivedOutsideSpot
    },

    canChangeRoomPreferenceWithPartialReset () {
      return this.myRegistration 
        && this.myRegistration.roomPreference === 'insidepreference'
        && !this.myRegistration.receivedInsideSpot
        && this.myRegistration.receivedOutsideSpot
    },

    registrationStatus () {
      if (!this.$store.state.isLoggedIn) {
        return 'notLoggedIn'
      }
      else if (!this.$store.state.userData.registrationId || !this.myRegistration) {
        return 'noRegistration'
      }
      else if (this.myRegistration.isAdminApproved) {
        return 'approved'
      }
      else if (this.myRegistration.isAdminApproved === false) {
        return 'rejected'
      }
      else {
        return 'unapproved'
      }
    },

    isEditingUnapprovedRoomPreference () {
      return this.newRegistration.roomPreference !== this.myRegistration.roomPreference
    },
  
    isDeleteUsernameEqual () {
      return this.deleteRegistrationUsername === this.$store.state.userData.username
    },

    isWaitingForBothSpots () {
      return this.myRegistration
        && this.myRegistration.roomPreference === 'insidepreference'
        && this.myRegistration.receivedInsideSpot === false
        && this.myRegistration.receivedOutsideSpot === false
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

    cancelDeleting () {
      this.deleteRegistrationUsername = ''
      this.isDeletingRegistration = false
    },

    async confirmDeleteRegistration () {
      if (!this.isDeleteUsernameEqual) { return }

      let result = await registrationApi.deleteRegistration(this.$store.state.userData.id)

      if ('error' in result) {
        this.responseMessage = result.error
        this.responseMessageType = 'error'
      }
      else {
        this.responseMessage = 'Successfully deleted registration'
        this.responseMessageType = 'success'
        this.cancelDeleting()
        this.$store.dispatch('refreshUserData')
        this.getRegistration()
      }

      this.scrollTop()
    },

    async updateRegistration () {
      let result
      if (this.isEditingRoomPreference === true) {
        result = await this.updateRoomPreference(this.$store.state.userData.id, this.newRegistration.roomPreference)
      }
      else {
        result = await registrationApi.updateRegistration(this.$store.state.userData.id, this.newRegistration)
      }

      if ('error' in result) {
        this.responseMessage = result.error
        this.responseMessageType = 'error'
      }
      else {
        this.responseMessage = 'Update successful'
        this.responseMessageType = 'success'
        this.cancelEditing()
        this.getRegistration()
      }

      this.scrollTop()
    },

    async updateRoomPreference (userId, newRoomPreference) {
      let registrationDataToSend = {...this.myRegistration}
      registrationDataToSend.roomPreference = newRoomPreference
      
      return await registrationApi.updateRegistration(userId, registrationDataToSend)
    },

    async getRegistration () {
      this.isLoadingRegistration = true
      
      if (!this.$store.getters.isLoggedIn) {
        this.setupLoginListener()
        this.isLoadingRegistration = false
        return
      }

      await this.$store.dispatch('getMyRegistration')

      this.newRegistration = {...this.myRegistration}
      this.isLoadingRegistration = false
    },

    cancelEditing () {
      this.newRegistration = {...this.myRegistration}
      this.isEditingRoomPreference = false
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

    scrollTop () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },

    formatDatetimeWithoutYear (dateTime) {
      dateTime = new Date(dateTime)
      return dateTime===null ? '' : dateTime.toDateString().substring(0,10) + ', ' + dateTime.toTimeString().substring(0,5)
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
<style lang="scss">
.shadow-box {
  border: 0.5px solid #888;
  background-color: white;
  padding: 10px 14px;
  margin-bottom: 16px;
  margin-top: 8px;
  box-shadow: 0 8px 16px 0px rgba(10, 14, 29, 0.04), 0px 8px 64px 0px rgba(10, 14, 29, 0.08);
}
</style>