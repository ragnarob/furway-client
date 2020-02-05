<template>
  <table v-if="pendingRegistrations.length > 0" class="very-wide-table" id="pendingRegistrationTable">
    <tr>
      <th>Username</th>
      <th>First name</th>
      <th>Last name</th>
      <th>Room pref</th>
      <th>Submitted</th>
      <th>Action</th>
    </tr>
    <tr v-for="reg in pendingRegistrations" :key="reg.id" :class="{'highlighted-row': reg.username === highlightedUsername}">
      <td>{{reg.username}}</td>
      <td>{{reg.firstName}}</td>
      <td>{{reg.lastName}}</td>
      <td>{{formatRoomPreference(reg.roomPreference)}}</td>
      <td>{{formatTimestamp(reg.timestamp, timestampFormat)}}</td>
      <td v-if="!isRejectingRegistration">
        <button @click="approveRegistration(reg)" class="theme-button double-button">
          <ConfirmIcon/>Approve
        </button>
        <button @click="startRejectingRegistration(reg)" class="double-button">
          <CancelIcon/>Reject
        </button>
        <button @click="highlightUser(reg.username)" class="double-button">
          <DownIcon/>Show full user
        </button>
      </td>
      <td v-else-if="isRejectingRegistration && rejectingRegistrationId===reg.id">
        <button @click="cancelRejectingRegistration()" class="double-button">
          <CancelIcon title=""/>Cancel
        </button>
        <button @click="rejectRegistration(reg)" class="danger-button double-button">
          <ConfirmIcon title=""/>Confirm rejection
        </button>
      </td>
      <td v-else>
      </td>
    </tr>
  </table>

  <p v-else>
    No pending registrations
  </p>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatTimestamp, formatRoomPreference, sleepMillisec } from '../utils'
import registrationApi from '../api/registration-api'
import CancelIcon from 'vue-material-design-icons/Close.vue'
import ConfirmIcon from 'vue-material-design-icons/Check.vue'
import DownIcon from 'vue-material-design-icons/ArrowDown.vue'

export default {
  name: 'pendingRegistrations',

  components: {
    CancelIcon, ConfirmIcon, DownIcon,
  },

  computed: {
    ...mapGetters(['pendingRegistrations', 'highlightedUsername', 'isAllUsersOpen', 'timestampFormat'])
  },

  data: function () {
    return {
      errorMessage: '',
      isRejectingRegistration: false,
      rejectingRegistrationId: undefined,
    }
  },

  methods: {    
    async approveRegistration (reg) {
      let result = await registrationApi.approveRegistration(reg.userId)

      if ('error' in result) {
        this.errorMessage = result.error
        this.scrollToErrorMessage()
      }
      else {
        this.$store.dispatch('loadAllAdminData')
      }
    },

    startRejectingRegistration (registration) {
      this.isRejectingRegistration = true
      this.rejectingRegistrationId = registration.id
    },

    cancelRejectingRegistration () {
      this.isRejectingRegistration = false
      this.rejectingRegistrationId = undefined
    },
    
    async rejectRegistration (reg) {
      let result = await registrationApi.rejectRegistration(reg.userId)

      if ('error' in result) {
        this.errorMessage = result.error
        this.scrollToErrorMessage()
      }
      else {
        this.$store.dispatch('loadAllAdminData')
        this.cancelRejectingRegistration()
      }
    },

    async highlightUser (username) {
      if (!this.isAllUsersOpen) {
        this.$store.commit('setIsAllUsersOpen', true)
        await sleepMillisec(80)
      }

      this.$store.commit('setHighlightedUsername', username)
    },

    formatTimestamp, 
    formatRoomPreference,
  },
}
</script>

<style lang="scss">
#pendingRegistrationTable {
  td {
    height: 30px;
  }
}
</style>