<template>
  <div class="flex-col limit-full-width">
    <h1>My Registration</h1>
    
    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" :scrollToTop="true" @closeMessage="closeResponseMessage" v-if="responseMessage"/>

    <LoadingMessage :message="'Loading registration...'" v-if="isLoadingRegistration"/>


    <!-- REFUND -->
    <div v-else-if="registrationStatus == 'approved' && !myRegistration.refundChoice && myRegistration.paidAmount > 0" class="shadow-box flex-col">
      <h3 class="no-margin-top">REFUND</h3>
      <p style="text-align: left; align-self: flex-start;">
        You have partially or fully paid your registration. You have three options regarding what we do with your money. The amount in question is <b>{{myRegistration.paidAmount}} NOK</b>.
      </p>
      <p style="text-align: left; align-self: flex-start; margin-top: 10px;">
        If you do not make a choice by August 10th, your money will automatically be refunded.
      </p>
      
      <div class="flex-col left-align-content margin-top-10">
        <div class="margin-top-4 room-pref-picker" style="text-align: left;">

          <div class="room-pref-option no-margin-top" 
               :class="{'selected-option': refundChoice=='refund'}"
               @click="selectRefundChoice('refund')">
            <label>Refund</label>
            <p class="room-pref-description">Your money will be refunded to the account you paid with</p>
          </div>

          <div class="room-pref-option" 
               :class="{'selected-option': refundChoice=='donateFW'}"
               @click="selectRefundChoice('donateFW')">
            <label>Donate to Furway</label> 
            <p class="room-pref-description">Help Furway get even better next year!</p>
          </div>

          <div class="room-pref-option" 
               :class="{'selected-option': refundChoice=='donateBLM'}"
               @click="selectRefundChoice('donateBLM')">
            <label>Donate to The NAACP Legal Defense and Educational Fund</label>
            <p class="room-pref-description">A Black Lives Matter charity ogranization chosen by the Furway board</p>
          </div>
        </div>
      </div>

      <button v-if="refundChoice" @click="submitRefundChoice" class="big-button theme-button margin-top-20">
        Submit choice
      </button>
    </div>

    <!-- HAS REFUNDED -->
    <div v-else-if="registrationStatus == 'approved' && myRegistration.refundChoice" class="shadow-box">
      <h3 class="no-margin-top">Refund</h3>
      <p>You paid <b>{{myRegistration.paidAmount}} NOK</b>, and you have chosen the refund method: {{refundChoiceToText(myRegistration.refundChoice)}}.</p>
    </div>

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
          Your registration was submitted {{formatDatetimeWithSeconds(myRegistration.timestamp)}}.
        </p>
      </div>

      <h3>Ticket type</h3>
      <div class="flex-col left-align-content">
        <div class="margin-top-4 room-pref-picker" style="text-align: left;">

          <div class="room-pref-option no-margin-top" 
               :class="{'selected-option': newRegistration.roomPreference=='insideonly'}"
               @click="selectRoomPreference('insideonly')">
            <label for="roomPreferenceRadioInside">Inside only</label>
            <p class="room-pref-description">Either I sleep inside or I won't attend</p>
          </div>

          <div class="room-pref-option" 
               :class="{'selected-option': newRegistration.roomPreference=='insidepreference'}"
               @click="selectRoomPreference('insidepreference')">
            <label for="roomPreferenceRadioPreference">Inside preference</label> 
            <p class="room-pref-description">If I don't get a spot inside, I'll take an outside slot if available</p>
          </div>

          <div class="room-pref-option" 
               :class="{'selected-option': newRegistration.roomPreference=='outsideonly'}"
               @click="selectRoomPreference('outsideonly')">
            <label for="roomPreferenceRadioOutside">Outside only</label>
            <p class="room-pref-description">Either I sleep outside, or I won't attend</p>
          </div>
        </div>
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
          Your registration was approved {{formatDatetime(myRegistration.timestamp)}}.
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
        <div class="margin-top-4 room-pref-picker" style="text-align: left;">
          <div class="room-pref-option no-margin-top" 
               :class="{'selected-option': newRegistration.roomPreference=='insideonly',
                        'hide-cursor-pointer': !isEditingRoomPreference}"
               @click="selectApprovedRoomPreference('insideonly')">
            <label for="roomPreferenceRadioInside">Inside only</label>
            <p class="room-pref-description">Either I sleep inside or I won't attend</p>
          </div>

          <div class="room-pref-option" 
               :class="{'selected-option': newRegistration.roomPreference=='insidepreference',
                        'hide-cursor-pointer': !isEditingRoomPreference}"
               @click="selectApprovedRoomPreference('insidepreference')">
            <label for="roomPreferenceRadioPreference">Inside preference</label> 
            <p class="room-pref-description">If I don't get a spot inside, I'll take an outside slot if available</p>
          </div>

          <div class="room-pref-option" 
               :class="{'selected-option': newRegistration.roomPreference=='outsideonly',
                        'hide-cursor-pointer': !isEditingRoomPreference}"
               @click="selectApprovedRoomPreference('outsideonly')">
            <label for="roomPreferenceRadioOutside">Outside only</label>
            <p class="room-pref-description">Either I sleep outside, or I won't attend</p>
          </div>
        </div>
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

      <!-- ADDONS -->
      <div v-show="!isEditingRoomPreference" class="flex-col">
        <h3>Add-ons</h3>
        <p class="margin-bottom-10">
          Adding or removing add-ons will not affect your spot. Paid amounts will not be refunded.
        </p>
        <p v-if="!receivedSomeSpot" class="margin-bottom-10">
          You cannot add add-ons until you receive a spot.
        </p>
        <p v-else-if="isPaymentDeadlinePassed" class="margin-bottom-10">
          Payment deadline passed. You cannot add or remove add-ons.
        </p>

        <div>

          <!-- EARLY OG LATE -->
          <div class="flex-col left-align-content">
            <div class="box-with-label">
              <input type="checkbox" v-model="newRegistration.earlyArrival" :disabled="!canEditAddons" id="updateRegearlyArrival"/>
              <label for="updateRegearlyArrival">Early arrival ({{conInfo.earlyArrivalPriceNok}} kr)</label>
            </div>
            <div class="box-with-label">
              <input type="checkbox" v-model="newRegistration.lateDeparture"  :disabled="!canEditAddons" id="updateReglateDeparture"/>
              <label for="updateReglateDeparture">Late departure ({{conInfo.lateDeparturePriceNok}} kr)</label>
            </div>
          </div>
          <br>

          <!-- HOODIE OG T-SKJORTE -->
          <div class="flex-col left-align-content">
            <span v-if="$store.state.conInfo.isSellingHoodies" class="flex-row-center">
              <div class="box-with-label">
                <input type="checkbox" v-model="newRegistration.buyHoodie" @change="possibleResetHoodieSize" :disabled="!canEditAddons" id="newRegistrationbuyHoodie"/>
                <label for="newRegistrationbuyHoodie">Buy hoodie ({{conInfo.hoodiePriceNok}} kr)</label>
              </div>
              <select v-model="newRegistration.hoodieSize" v-show="newRegistration.buyHoodie" class="margin-left-10">
                <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
              </select>
            </span>

            <span v-if="$store.state.conInfo.isSellingTshirts" class="flex-row-center">
              <div class="box-with-label">
                <input type="checkbox" v-model="newRegistration.buyTshirt" @change="possibleResetTshirtSize" :disabled="!canEditAddons" id="newRegistrationbuyTshirt"/>
                <label for="newRegistrationbuyTshirt">Buy t-shirt ({{conInfo.tshirtPriceNok}} kr)</label>
              </div>
              <select v-model="newRegistration.tshirtSize" v-show="newRegistration.buyTshirt" class="margin-left-10">
                <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
              </select>
            </span>
          <br>
          </div>

          <div class="flex-col left-align-content">
            <div class="flex-row">
              <input type="checkbox" v-model="isDonating" @change="isDonatingChanged" :disabled="!canEditAddons" id="newRegistrationDonation"/>
              <label for="newRegistrationDonation">I would like to donate to Furway</label>
            </div>
            <div v-show="isDonating" class="flex-row-center">
              <p class="margin-right-4">Amount in NOK: </p>
              <input type="number" min="1" v-model="newRegistration.donationAmount" style="width: 80px;"/>
            </div>
          </div>
        </div>

        <div v-show="canSaveAddons" class="margin-top-10">
          <button @click="cancelEditing" class="big-button neutral-button double-button">
            <CancelIcon title=""/>Cancel
          </button>
          <button @click="updateRegistration" class="big-button theme-button double-button margin-left-10">
            <SaveIcon title=""/>Save
          </button>
        </div>
      </div>

      <!-- PAYMENT -->
      <div v-show="!isEditingRoomPreference">
        <h3>Payment</h3>
        <p v-if="receivedSomeSpot" class="margin-bottom-10">
          Your payment deadline: <b>{{formatDatetimeWithWeekday(myRegistration.paymentDeadline)}}</b>
        </p>
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

          <tr v-if="myRegistration.donationAmount > 0">
            <td>Donation</td>
            <td>{{myRegistration.donationAmount}}</td>
          </tr>

          <thead>
            <tr>
              <th colspan="3"></th>
            </tr>
          </thead>

          <tr>
            <td>Total amount to be paid</td>
            <td colspan="2">
              {{myRegistration.totalAmount}}
              <span v-if="isWaitingForBothSpots">
                <br/>
                {{`(+${conInfo.mainDaysInsidePriceNok - conInfo.mainDaysOutsidePriceNok} if inside)`}}
              </span>
            </td>
          </tr>

          <tr>
            <td>Total paid amount</td>
            <td colspan="2">{{myRegistration.paidAmount}}</td>
          </tr>

          <tr v-if="receivedSomeSpot">
            <td><b>Remaining amount</b></td>
            <td colspan="2">
              <b>{{myRegistration.unpaidAmount}}</b>
              <p v-if="myRegistration.unpaidAmount < 5 && myRegistration.unpaidAmount > 0">Amount too low to process, consider it paid</p>
            </td>
          </tr>
        </table>

        <!-- CAN PAY -->
        <Payment v-if="receivedSomeSpot && myRegistration.unpaidAmount >= 5" 
                 @success="onPaymentSuccess"
                 :amount="myRegistration.unpaidAmount"
                 class="margin-top-10"/>

        <p v-else-if="receivedSomeSpot && myRegistration.unpaidAmount < 5" class="margin-top-10">
          Nothing left to pay!
        </p>

        <!-- CAN NOT PAY -->
        <p v-else class="margin-top-10">
          You cannot make any payments until you have received a spot.
        </p>
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
import Payment from '../components/payment/Payment.vue'

import SaveIcon from 'vue-material-design-icons/ContentSave.vue'
import CancelIcon from 'vue-material-design-icons/Close.vue'
import DeleteIcon from 'vue-material-design-icons/DeleteOutline.vue'

import { mapGetters } from 'vuex'
import { formatBoolean, sleepMillisec } from '../utils'

export default {
  name: 'myRegistration',

  components: {
    ResponseMessage, LoadingMessage, Payment,
    SaveIcon, CancelIcon, DeleteIcon,
  },

  data: function () {
    return {
      isLoadingRegistration: true,
      isEditingRoomPreference: false,
      isDeletingRegistration: false,
      deleteRegistrationUsername: '',
      isDonating: false,
      responseMessage: '',
      responseMessageType: 'error',
      newRegistration: null,
      sizes: ['S','M','L','XL','XXL', '3XL', '4XL'],
      refundChoice: undefined,
    }
  },

  computed: {
    ...mapGetters(['myRegistration', 'conInfo']),

    receivedSomeSpot () {
      return this.myRegistration && (this.myRegistration.receivedInsideSpot || this.myRegistration.receivedOutsideSpot)
    },

    isPaymentDeadlinePassed () {
      return this.myRegistration && (new Date() > new Date(this.myRegistration.paymentDeadline))
    },

    canEditAddons () {
      return this.receivedSomeSpot && !this.isPaymentDeadlinePassed
    },

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
    selectRoomPreference (pref) {
      this.newRegistration.roomPreference = pref
    },

    selectApprovedRoomPreference (pref) {
      if (this.isEditingRoomPreference) {
        this.newRegistration.roomPreference = pref
      }
    },

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

    isDonatingChanged () {
      if (!this.isDonating) {
        this.newRegistration.donationAmount = 0
      }
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
      this.isDonating = this.newRegistration.donationAmount > 0
    },

    cancelEditing () {
      this.newRegistration = {...this.myRegistration}
      this.isEditingRoomPreference = false
    },

    async onPaymentSuccess () {
      this.getRegistration()
      this.responseMessage = 'Payment successful!'
      this.responseMessageType = 'success'
      this.scrollTop()
    },

    selectRefundChoice (choice) {
      this.refundChoice = choice
    },

    async submitRefundChoice () {
      let result = await registrationApi.submitRefundChoice(this.$store.state.userData.id, this.refundChoice)

      if ('error' in result) {
        this.responseMessage = result.error
        this.responseMessageType = 'error'
      }
      else {
        this.$store.dispatch('refreshUserData')
      }
    },

    refundChoiceToText (choice) {
      if (choice === 'refund') { return 'Full refund' }
      if (choice === 'donateFW') { return 'Donate to Furway' }
      if (choice === 'donateBLM') { return 'Donate to NAACP Legal Defense and Educational Fund'}
    },

    closeResponseMessage () {
      this.responseMessage = ''
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

    formatDatetime (dateTime) {
      dateTime = new Date(dateTime.substring(0,19))
      return dateTime===null ? '' : dateTime.toDateString().substring(4,10) + ', ' + dateTime.toTimeString().substring(0,5)
    },

    formatDatetimeWithWeekday (dateTime) {
      dateTime = new Date(dateTime)
      return dateTime===null ? '' : dateTime.toDateString().substring(0,10) + ', ' + dateTime.toTimeString().substring(0,5)
    },

    formatDatetimeWithSeconds (dateTime) {
      dateTime = new Date(dateTime)
      return `${dateTime===null ? '' : dateTime.toDateString().substring(0,10)}, ${dateTime.toTimeString().substring(0,8)}`
    },

    formatBoolean,
  },

  async mounted () {
    this.getRegistration()
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
.stripe-card {
  width: 300px;
  border: 1px solid grey;
}
.stripe-card.complete {
  border-color: green;
}
</style>