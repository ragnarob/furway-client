<template>
  <div style="width: 100%;" v-show="isAllRegistrationsOpen">

    <div style="margin-bottom: 2px;">
      <input type="checkbox" v-model="shouldFilterList" id="onlyShowWithGivenSpotsCheckbox">
      <label for="onlyShowWithGivenSpotsCheckbox">Only show registrations with given spots</label>
    </div>

    <table class="very-wide-table">
      <tr>
        <th>Action</th>
        <th>Id</th>
        <th>Username</th>
        <th>Ticket</th>
        <th title="Approved">Appr.</th>
        <th>Early</th>
        <th>Late</th>
        <th title="T-shirt">Ts.</th>
        <th title="Hoodie">Hd.</th>
        <th title="T-shirt size">Ts. sz</th>
        <th title="Hoodie size">Hd. sz</th>
        <th title="Submitted time">Subm.</th>
        <th title="Payment deadline">Pay deadl.</th>
        <th title="Received inside spot">Rec. ins.</th>
        <th title="Received outside spot">Rec. outs.</th>
      </tr>
      <tr v-for="reg in filteredRegistrations" :key="reg.id" :class="{'highlighted-row-blue': reg.id === highlightedRegistrationId}">
        <td>
          <button v-if="registrationBeingEdited === null" @click="editRegistration(reg.id)" class="icon-button icon-button-small neutral-button">
            <EditIcon title="Edit"/>
          </button>
          <button v-if="registrationBeingEdited === null" @click="deleteRegistration(reg.id)" class="icon-button icon-button-small neutral-button">
            <DeleteIcon title="Delete"/>
          </button>


          <button v-if="isThisRegistrationBeingEdited(reg.id)" @click="cancelEditing()" class="icon-button icon-button-small neutral-button">
            <CancelIcon title="Cancel"/>
          </button>
          <button v-if="isThisRegistrationBeingEdited(reg.id)" @click="saveRegistration()" class="icon-button icon-button-small theme-button">
            <SaveIcon title="Save"/>
          </button>
        </td>

        <td>
          <p :class="{'non-editable-cell': isThisRegistrationBeingEdited(reg.id), 'registration-id-cell': true}">
            {{reg.id}}
          </p>
        </td>

        <td>
          <p :class="{'non-editable-cell': isThisRegistrationBeingEdited(reg.id)}">
            {{reg.username}}
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.roomPreference" value="insideonly" @change="warnNotPreferredMethodRoomPreference"/>Inside only
            <input type="radio" v-model="registrationBeingEdited.roomPreference" value="outsideonly" @change="warnNotPreferredMethodRoomPreference"/>Outside only
            <input type="radio" v-model="registrationBeingEdited.roomPreference" value="insidepreference" @change="warnNotPreferredMethodRoomPreference"/>Inside preference
          </span>
          
          <p v-else>{{formatRoomPreference(reg.roomPreference)}}</p>
        </td>

        <td>
          <p :class="{'non-editable-cell': isThisRegistrationBeingEdited(reg.id)}">
            <YesIcon v-if="reg.isAdminApproved" title="Yes"/>
            <NoIcon v-else-if="reg.isAdminApproved === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.earlyArrival" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.earlyArrival" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.earlyArrival" title="Yes"/>
            <NoIcon v-else-if="reg.earlyArrival === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.lateDeparture" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.lateDeparture" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.lateDeparture" title="Yes"/>
            <NoIcon v-else-if="reg.lateDeparture === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.buyTshirt" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.buyTshirt" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.buyTshirt" title="Yes"/>
            <NoIcon v-else-if="reg.buyTshirt === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.buyHoodie" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.buyHoodie" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.buyHoodie" title="Yes"/>
            <NoIcon v-else-if="reg.buyHoodie === false" title="No"/>
          </p>
        </td>

        <td>
          <select v-model="registrationBeingEdited.tshirtSize" v-if="isThisRegistrationBeingEdited(reg.id)">
            <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
          </select>

          <p v-else>{{reg.tshirtSize}}</p>
        </td>

        <td>
          <select v-model="registrationBeingEdited.hoodieSize" v-if="isThisRegistrationBeingEdited(reg.id)">
            <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
          </select>

          <p v-else>{{reg.hoodieSize}}</p>
        </td>

        <td>
          <p :class="{'non-editable-cell': isThisRegistrationBeingEdited(reg.id)}">
            {{formatTimestamp(reg.timestamp)}}
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="flex-col">
            <input type="date" v-model="registrationBeingEdited.paymentDeadline"/>
            <button @click="clearPaymentDeadlineDate">Clear</button>
          </span>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.receivedInsideSpot" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.receivedInsideSpot" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.receivedInsideSpot" title="Yes"/>
            <NoIcon v-else-if="reg.receivedInsideSpot === false" title="No"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.receivedOutsideSpot" value="true" @change="warnNotPreferredMethodReceivedSpot"/>True
            <input type="radio" v-model="registrationBeingEdited.receivedOutsideSpot" value="false"@change="warnNotPreferredMethodReceivedSpot"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.receivedOutsideSpot" title="Yes"/>
            <NoIcon v-else-if="reg.receivedOutsideSpot === false" title="No"/>
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

import { mapGetters } from 'vuex'
import { formatTimestamp, formatRoomPreference } from '../utils'

export default {
  name: 'registrationList',

  props: {
    isOpen: Boolean,
  },

  components: {
    YesIcon, NoIcon, EditIcon, SaveIcon, CancelIcon, DeleteIcon,
  },

  data: function () {
    return {
      registrationBeingEdited: null,
      sizes: [null, 'S','M','L','XL','XXL'],
      shouldFilterList: false,
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
    isThisRegistrationBeingEdited (regId) {
      return this.registrationBeingEdited !== null && this.registrationBeingEdited.id === regId
    },

    editRegistration (regId) {
      this.registrationBeingEdited = {...this.allRegistrations.find(reg => reg.id === regId)}
      this.registrationBeingEdited.timestamp = new Date(this.registrationBeingEdited.timestamp).toISOString().substr(0,10)
    },

    warnNotPreferredMethodRoomPreference () {
      window.alert(`Note: This is NOT the preferred way to change ticket types. In most cases, users should change it themselves, and then possibly be put back in waiting lists. Changing ticket type via the admin panel will NOT put users back in the waiting lists, nor remove spots given or change payment statuses/deadlines. Therefore, if the ticket type is changed via the admin panel, these fields should also be set to their correct values.`)
    },

    warnNotPreferredMethodReceivedSpot () {
      window.alert(`Note: This is NOT the standard way to give spots to registrants, and should only be used in special cases where the system won't automatically assign spots based on timestamps as sorted in the waiting lists`)
    },

    deleteRegistration (regId) {

    },

    cancelEditing () {
      this.registrationBeingEdited = null
    },

    saveRegistration () {
      
    },

    clearPaymentDeadlineDate () {
      this.registrationBeingEdited.paymentDeadline = null
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