<template>
  <div style="width: 100%;" v-show="isAllRegistrationsOpen">
    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"/>
    <LoadingMessage :message="'Saving...'" v-if="isSaving"/>

    <div style="margin-bottom: 2px;">
      <input type="checkbox" v-model="shouldFilterList" id="onlyShowWithGivenSpotsCheckbox">
      <label for="onlyShowWithGivenSpotsCheckbox">Only show registrations with given spots</label>
    </div>

    <table class="very-wide-table">
      <tr>
        <th>Action</th>
        <th>Reg #</th>
        <th>Username</th>
        <th>Ticket</th>
        <th title="Approved">Appr.</th>
        <th>Early</th>
        <th>Late</th>
        <th title="T-shirt">Ts.</th>
        <th title="Hoodie">Hd.</th>
        <th title="T-shirt size">Ts. sz</th>
        <th title="Hoodie size">Hd. sz</th>
        <th title="Timestamp for submission if not approved, timestamp for approval if approved">Timest.</th>
        <th title="Payment deadline">Pay deadl.</th>
        <th title="Received inside spot">Rec. ins.</th>
        <th title="Received outside spot">Rec. outs.</th>
        <th>Money</th>
        <th>Donation</th>
      </tr>

      <tr v-for="reg in filteredRegistrations" :key="reg.id" :class="{'highlighted-row-blue': reg.id === highlightedRegistrationId}" style="height: 38px;">
        <td>
          <!-- DEFAULT -->
          <button v-if="registrationBeingEdited === null && userIdBeingDeleted === null" @click="editRegistration(reg.id)" class="icon-button icon-button-small neutral-button">
            <EditIcon title="Edit"/>
          </button>
          <button v-if="registrationBeingEdited === null && userIdBeingDeleted === null" @click="startDeletingRegistration(reg.userId)" class="icon-button icon-button-small neutral-button">
            <DeleteIcon title="Delete"/>
          </button>

          <!-- EDITING -->
          <button v-if="isRegistrationBeingEdited(reg.id)" @click="cancelEditing()" class="icon-button icon-button-small neutral-button">
            <CancelIcon title="Cancel"/>
          </button>
          <button v-if="isRegistrationBeingEdited(reg.id)" @click="saveRegistration()" class="icon-button icon-button-small theme-button">
            <SaveIcon title="Save"/>
          </button>

          <!-- DELETING -->
          <button v-if="userIdBeingDeleted === reg.userId" @click="cancelDeleting()" class="neutral-button big-button double-button">
            <NoIcon/>Cancel
          </button>
          <button v-if="userIdBeingDeleted === reg.userId" @click="deleteRegistration()" class="danger-button big-button" style="padding-right: 10px">
            Confirm <FilledDeleteIcon title=""/>
          </button>
        </td>

        <td>
          <p :class="{'non-editable-cell': isEditableCell(reg.id), 'registration-id-cell': true}">
            {{reg.registrationNumber}}
          </p>
        </td>

        <td>
          <p :class="{'non-editable-cell': isEditableCell(reg.id)}">
            {{reg.username}}
          </p>
        </td>

        <td>
          <span v-if="isEditableCell(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.roomPreference" value="insideonly" @change="warnNotPreferredMethodRoomPreference" id="roomPrefInside"/>
            <label for="roomPrefInside">Inside only</label>

            <input type="radio" v-model="registrationBeingEdited.roomPreference" value="outsideonly" @change="warnNotPreferredMethodRoomPreference" id="roomPrefOutside"/>
            <label for="roomPrefOutside">Outside only</label>

            <input type="radio" v-model="registrationBeingEdited.roomPreference" value="insidepreference" @change="warnNotPreferredMethodRoomPreference" id="roomPrefInsidePref"/>
            <label for="roomPrefInsidePref">Inside preference</label>
          </span>
          
          <p v-else>{{formatRoomPreference(reg.roomPreference)}}</p>
        </td>

        <td>
          <p :class="{'non-editable-cell': isEditableCell(reg.id)}">
            <YesIcon v-if="reg.isAdminApproved" title="Yes"/>
            <NoIcon v-else-if="reg.isAdminApproved === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isEditableCell(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.earlyArrival" :value="true" id="earlyArrivalYes"/>
            <label for="earlyArrivalYes">Yes</label>

            <input type="radio" v-model="registrationBeingEdited.earlyArrival" :value="false" id="earlyArrivalNo"/>
            <label for="earlyArrivalNo">No</label>
          </span>

          <p v-else>
            <YesIcon v-if="reg.earlyArrival" title="Yes"/>
            <NoIcon v-else-if="reg.earlyArrival === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isEditableCell(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.lateDeparture" :value="true" id="lateDepartureYes"/>
            <label for="lateDepartureYes">Yes</label>

            <input type="radio" v-model="registrationBeingEdited.lateDeparture" :value="false" id="lateDepartureNo"/>
            <label for="lateDepartureNo">No</label>
          </span>

          <p v-else>
            <YesIcon v-if="reg.lateDeparture" title="Yes"/>
            <NoIcon v-else-if="reg.lateDeparture === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isEditableCell(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.buyTshirt" :value="true" id="buyTshirtYes"/>
            <label for="buyTshirtYes">Yes</label>

            <input type="radio" v-model="registrationBeingEdited.buyTshirt" :value="false" id="buyTshirtNo"/>
            <label for="buyTshirtNo">No</label>
          </span>

          <p v-else>
            <YesIcon v-if="reg.buyTshirt" title="Yes"/>
            <NoIcon v-else-if="reg.buyTshirt === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isEditableCell(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.buyHoodie" :value="true" id="buyHoodieYes"/>
            <label for="buyHoodieYes">Yes</label>
            
            <input type="radio" v-model="registrationBeingEdited.buyHoodie" :value="false" id="buyHoodieNo"/>
            <label for="buyHoodieNo">No</label>
          </span>

          <p v-else>
            <YesIcon v-if="reg.buyHoodie" title="Yes"/>
            <NoIcon v-else-if="reg.buyHoodie === false" title="No"/>
          </p>
        </td>

        <td>
          <select v-model="registrationBeingEdited.tshirtSize" v-if="isEditableCell(reg.id)">
            <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
          </select>

          <p v-else>{{reg.tshirtSize}}</p>
        </td>

        <td>
          <select v-model="registrationBeingEdited.hoodieSize" v-if="isEditableCell(reg.id)">
            <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
          </select>

          <p v-else>{{reg.hoodieSize}}</p>
        </td>

        <td>
          <p :class="{'non-editable-cell': isEditableCell(reg.id)}">
            {{formatTimestamp(reg.timestamp, timestampFormat)}}
          </p>
        </td>

        <td>
          <span v-if="isEditableCell(reg.id)" class="flex-col">
            <input type="date" v-model="registrationBeingEdited.paymentDeadline"/>
            <button @click="clearPaymentDeadlineDate">Clear</button>
          </span>

          <p v-else>
            {{formatTimestamp(reg.paymentDeadline, timestampFormat)}}
          </p>
        </td>

        <td>
          <span v-if="isEditableCell(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.receivedInsideSpot" :value="true" id="recInsideSpotYes"/>
            <label for="recInsideSpotYes">Yes</label>

            <input type="radio" v-model="registrationBeingEdited.receivedInsideSpot" :value="false" id="recInsideSpotNo"/>
            <label for="recInsideSpotNo">No</label>
          </span>

          <p v-else>
            <YesIcon v-if="reg.receivedInsideSpot" title="Yes"/>
            <NoIcon v-else-if="reg.receivedInsideSpot === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isEditableCell(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.receivedOutsideSpot" :value="true" @change="warnNotPreferredMethodReceivedSpot" id="recOutsideSpotYes"/>
            <label for="recOutsideSpotYes">Yes</label>

            <input type="radio" v-model="registrationBeingEdited.receivedOutsideSpot" :value="false" @change="warnNotPreferredMethodReceivedSpot" id="recOutsideSpotNo"/>
            <label for="recOutsideSpotNo">No</label>
          </span>

          <p v-else>
            <YesIcon v-if="reg.receivedOutsideSpot" title="Yes"/>
            <NoIcon v-else-if="reg.receivedOutsideSpot === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isRegistrationBeingEdited(reg.id)&& !isOverridingPayment">
            {{reg.paidAmount}} paid, {{reg.totalAmount}} total
            <br/>
            <button class="small-button" @click="startPaymentOverride">Override</button>
          </span>

          <span v-else-if="isRegistrationBeingEdited(reg.id) && isOverridingPayment">
            Paid: <input type="number" v-model="registrationBeingEdited.paidAmount" style="width: 100px;"/>
            <br>
            <p>({{reg.totalAmount}} total)</p>
          </span>

          <p v-else>
            {{reg.paidAmount}} paid, {{reg.totalAmount}} total
          </p>
        </td>

        <td>
          <p v-if="reg.donationAmount > 0">
            {{reg.donationAmount}}
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import YesIcon from 'vue-material-design-icons/CheckCircle.vue'
import NoIcon from 'vue-material-design-icons/Close.vue'
import EditIcon from 'vue-material-design-icons/Pencil.vue'
import SaveIcon from 'vue-material-design-icons/ContentSave.vue'
import CancelIcon from 'vue-material-design-icons/Close.vue'
import DeleteIcon from 'vue-material-design-icons/DeleteOutline.vue'
import FilledDeleteIcon from 'vue-material-design-icons/Delete.vue'

import ResponseMessage from './ResponseMessage.vue'
import LoadingMessage from '../components/LoadingMessage.vue'
import { mapGetters } from 'vuex'
import { formatTimestamp, formatRoomPreference } from '../utils'
import registrationApi from '../api/registration-api'

export default {
  name: 'registrationList',

  props: {
    isOpen: Boolean,
  },

  components: {
    ResponseMessage, LoadingMessage,
    YesIcon, NoIcon, EditIcon, SaveIcon, CancelIcon, DeleteIcon, FilledDeleteIcon,
  },

  data: function () {
    return {
      registrationBeingEdited: null,
      userIdBeingDeleted: null,
      sizes: [null, 'S','M','L','XL','XXL', '3XL', '4XL'],
      shouldFilterList: false,
      isOverridingPayment: false,

      responseMessage: '',
      responseMessageType: 'info',
      isSaving: false,
    }
  },

  computed: {
    ...mapGetters(['allRegistrations', 'timestampFormat', 'highlightedRegistrationId', 'isAllRegistrationsOpen']),

    filteredRegistrations () {
      if (this.shouldFilterList) {
        return this.allRegistrations.filter(reg => reg.receivedInsideSpot === true || reg.receivedOutsideSpot === true)
      }
      else {
        return this.allRegistrations
      }
    }
  },

  methods: {
    isEditableCell (regId) {
      return this.isRegistrationBeingEdited(regId) && !this.isOverridingPayment
    },

    isRegistrationBeingEdited (regId) {
      return this.registrationBeingEdited !== null && this.registrationBeingEdited.id === regId
    },

    editRegistration (regId) {
      this.registrationBeingEdited = {...this.allRegistrations.find(reg => reg.id === regId)}
      this.registrationBeingEdited.timestamp = new Date(this.registrationBeingEdited.timestamp).toISOString().substr(0,10)
    },

    startPaymentOverride () {
      this.isOverridingPayment = true
    },

    warnNotPreferredMethodRoomPreference () {
      window.alert(`Note: This is NOT the preferred way to change ticket types. In most cases, users should change it themselves, and then possibly be put back in waiting lists. Changing ticket type via the admin panel will NOT put users back in the waiting lists, nor remove spots given or change payment statuses/deadlines. Therefore, if the ticket type is changed via the admin panel, these fields should also be set to their correct values.`)
    },

    warnNotPreferredMethodReceivedSpot () {
      window.alert(`Note: This is NOT the standard way to give spots to registrants, and should only be used in special cases where the system won't automatically assign spots based on timestamps as sorted in the waiting lists`)
    },

    cancelDeleting () {
      this.userIdBeingDeleted = null
    },

    startDeletingRegistration (userId) {
      this.userIdBeingDeleted = userId
    },

    async deleteRegistration () {
      if (this.isSaving) { return }
      this.isSaving = true

      let result = await registrationApi.deleteRegistration(this.userIdBeingDeleted)

      this.isSaving = false

      if ('error' in result) {
        this.responseMessage = result.error
        this.responseMessageType = 'error'
      }
      else {
        this.responseMessage = 'Delete successful!'
        this.responseMessageType = 'success'
        this.cancelDeleting()
        this.$store.dispatch('loadAllAdminData')
      }
    },

    cancelEditing () {
      this.isSaving = false
      this.registrationBeingEdited = null
      this.isOverridingPayment = false
    },

    async saveRegistration () {
      if (this.isSaving) { return }
      this.isSaving = true

      let result
      if (this.isOverridingPayment) {
        result = await registrationApi.overrideRegistrationPaymentAsAdmin(
          this.registrationBeingEdited.userId,
          this.registrationBeingEdited.paidAmount
        )
      }
      else {
        result = await registrationApi.updateRegistrationAsAdmin(
          this.registrationBeingEdited.userId,
          this.registrationBeingEdited
        )
      }

      this.processSaveResult(result)
    },

    processSaveResult (result) {
      this.isSaving = false

      if ('error' in result) {
        this.responseMessage = result.error
        this.responseMessageType = 'error'
      }
      else {
        this.responseMessage = 'Success!'
        this.responseMessageType = 'success'
        this.cancelEditing()
        this.$store.dispatch('loadAllAdminData')
      }
    },

    clearPaymentDeadlineDate () {
      this.registrationBeingEdited.paymentDeadline = null
    },

    closeResponseMessage () {
      this.responseMessage = ''
      this.responseMessageType = 'info'
    },

    formatTimestamp,
    formatRoomPreference,
  },

  watch: {
    highlightedRegistrationId: function (newVal, oldVal) {
      if (newVal === null) { return }
      let registrationElements = document.getElementsByClassName('registration-id-cell')
      for (var element of registrationElements) {
        if (element.textContent.trim() == newVal) {
          element.parentElement.scrollIntoView(true)
        }
      }
    },
  }
}
</script>