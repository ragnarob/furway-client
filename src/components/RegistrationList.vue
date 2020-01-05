<template>
  <div style="width: 100%;" v-show="isOpen">

    <div style="margin-bottom: 2px;">
      <input type="checkbox" v-model="shouldFilterList" st> Only show registrations with given spots
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
        <th title="Main days inside paid">Ins. paid</th>
        <th title="Main days outside paid">Outs. paid</th>
        <th title="Early arrival paid">Early paid</th>
        <th title="Late departure paid">Late paid</th>
        <th title="T-shirt paid">Ts. paid</th>
        <th title="Hoodie paid">Hd. paid</th>
      </tr>
      <tr v-for="reg in filteredRegistrations" :key="reg.id" :class="{'highlighted-row-blue': reg.id === highlightedRegistrationId}">
        <td>
          <button v-if="registrationBeingEdited === null" @click="editRegistration(reg.id)">Edit</button>
          <button v-if="registrationBeingEdited === null" @click="deleteRegistration(reg.id)">Del</button>

          <button v-if="isThisRegistrationBeingEdited(reg.id)" @click="cancelEditing()">Cancel</button>
          <br v-if="isThisRegistrationBeingEdited(reg.id)">
          <button v-if="isThisRegistrationBeingEdited(reg.id)" @click="saveRegistration()">Save</button>
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
            <YesIcon v-if="reg.isAdminApproved"/>
            <NoIcon v-else-if="reg.isAdminApproved === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.earlyArrival" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.earlyArrival" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.earlyArrival"/>
            <NoIcon v-else-if="reg.earlyArrival === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.lateDeparture" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.lateDeparture" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.lateDeparture"/>
            <NoIcon v-else-if="reg.lateDeparture === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.buyTshirt" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.buyTshirt" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.buyTshirt"/>
            <NoIcon v-else-if="reg.buyTshirt === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.buyHoodie" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.buyHoodie" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.buyHoodie"/>
            <NoIcon v-else-if="reg.buyHoodie === false"/>
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
            <YesIcon v-if="reg.receivedInsideSpot"/>
            <NoIcon v-else-if="reg.receivedInsideSpot === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.receivedOutsideSpot" value="true" @change="warnNotPreferredMethodReceivedSpot"/>True
            <input type="radio" v-model="registrationBeingEdited.receivedOutsideSpot" value="false"@change="warnNotPreferredMethodReceivedSpot"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.receivedOutsideSpot"/>
            <NoIcon v-else-if="reg.receivedOutsideSpot === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.isMainDaysInsidePaid" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.isMainDaysInsidePaid" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.isMainDaysInsidePaid"/>
            <NoIcon v-else-if="reg.isMainDaysInsidePaid === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.isMainDaysOutsidePaid" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.isMainDaysOutsidePaid" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.isMainDaysOutsidePaid"/>
            <NoIcon v-else-if="reg.isMainDaysOutsidePaid === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.isEarlyArrivalPaid" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.isEarlyArrivalPaid" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.isEarlyArrivalPaid"/>
            <NoIcon v-else-if="reg.isEarlyArrivalPaid === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.isLateDeparturePaid" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.isLateDeparturePaid" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.isLateDeparturePaid"/>
            <NoIcon v-else-if="reg.isLateDeparturePaid === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.isTshirtPaid" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.isTshirtPaid" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.isTshirtPaid"/>
            <NoIcon v-else-if="reg.isTshirtPaid === false"/>
          </p>
        </td>

        <td>
          <span v-if="isThisRegistrationBeingEdited(reg.id)" class="cell-with-radio">
            <input type="radio" v-model="registrationBeingEdited.isHoodiePaid" value="true"/>True
            <input type="radio" v-model="registrationBeingEdited.isHoodiePaid" value="false"/>False
          </span>

          <p v-else>
            <YesIcon v-if="reg.isHoodiePaid"/>
            <NoIcon v-else-if="reg.isHoodiePaid === false"/>
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import YesIcon from 'vue-material-design-icons/CheckCircle.vue'
import NoIcon from 'vue-material-design-icons/Close.vue'

export default {
  name: 'registrationList',

  props: {
    isOpen: Boolean,
    allRegistrations: Array,
    timestampFormat: String,
    highlightedRegistrationId: Number,
  },

  components: {
    YesIcon,
    NoIcon
  },

  data: function () {
    return {
      registrationBeingEdited: null,
      sizes: [null, 'S','M','L','XL','XXL'],
      shouldFilterList: false,
    }
  },

  computed: {
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

    formatTimestamp (timestamp) {
      if (this.timestampFormat === 'short') {
        return this.formatShortTimestamp(timestamp)
      }
      else {
        return this.formatLongTimestamp(timestamp)
      }
    },

    formatShortTimestamp (timestamp) {
      return new Date(timestamp).toDateString().substr(4,6)
    },

    formatLongTimestamp (timestamp) {
      let tsDate = new Date(timestamp)
      return tsDate.toDateString().substr(4,6) + ', ' + tsDate.toTimeString().substr(0,8)
    },

    formatRoomPreference (roomPreference) {
      if (roomPreference === 'insideonly') { return 'Inside only' }
      else if (roomPreference === 'outsideonly') { return 'Outside only' }
      else { return 'Inside pref' }
    }
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