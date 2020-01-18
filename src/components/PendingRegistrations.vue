<template>
  <table v-if="pendingRegistrations.length > 0">
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
      <td>
        <button @click="approveRegistration(reg)">Approve</button>
        <button @click="rejectRegistration(reg)">Reject</button>
        <button @click="highlightUser(reg.username)">Show full user</button>
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

export default {
  name: 'pendingRegistrations',

  computed: {
    ...mapGetters(['pendingRegistrations', 'highlightedUsername', 'isAllUsersOpen', 'timestampFormat'])
  },

  data: function () {
    return {
      errorMessage: '',
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
        this.$store.dispatch('loadData')
      }
    },
    
    async rejectRegistration (reg) {
      let result = await registrationApi.rejectRegistration(reg.userId)

      if ('error' in result) {
        this.errorMessage = result.error
        this.scrollToErrorMessage()
      }
      else {
        this.$store.dispatch('loadData')
      }
    },

    async highlightUser (username) {
      if (!this.isAllUsersOpen) {
        this.$store.commit('setIsAllUsersOpen', true)
        await sleepMillisec(80)
      }

      this.$store.commit('setHighlightedUsername', username)
    },

    scrollToErrorMessage () {
      // todo 
    },
    
    formatTimestamp, 
    formatRoomPreference,
  },
}
</script>