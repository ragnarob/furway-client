<template>
  <div v-show="isOpen">
    <table v-if="registrationsWithSpots.length > 0" class="very-wide-table">
      <tr>
        <th>Username</th>
        <th>First name</th>
        <th>Last name</th>
        <th>Room pref</th>
        <th>Given room</th>
        <th>Early/late</th>
        <th>Merch</th>
        <th>Money</th>
        <th>Action</th>
      </tr>
      <tr v-for="reg in registrationsWithSpots" :key="reg.id" :class="{'highlighted-row-blue': reg.id === highlightedRegistrationId}">
        <td>{{reg.username}}</td>
        <td>{{reg.firstName}}</td>
        <td>{{reg.lastName}}</td>
        <td>{{formatRoomPreference(reg.roomPreference)}}</td>
        <td>{{reg.receivedInsideSpot ? 'Inside' : 'Outside'}}</td>

        <td>
          <span class="flex-col">
            <span v-if="reg.earlyArrival">Early ({{reg.isEarlyArrivalPaid ? 'paid' : 'unpaid'}})</span>
            <span v-if="reg.lateDeparture">Late ({{reg.isLateDeparturePaid ? 'paid' : 'unpaid'}})</span>
          </span>
        </td>

        <td>
          <span class="flex-col">
            <span v-if="reg.buyHoodie">Hoodie, {{reg.hoodieSize}} ({{reg.isHoodiePaid ? 'paid' : 'unpaid'}})</span>
            <span v-if="reg.buyTshirt">T-shirt, {{reg.tshirtSize}} ({{reg.isTshirtPaid ? 'paid' : 'unpaid'}})</span>
          </span>
        </td>

        <td>{{reg.paidAmount}} paid, {{reg.unpaidAmount}} unpaid</td>

        <td>
          <button @click="removeSpotFromRegistration(reg)">Remove spot</button>
          <button @click="highlightRegistration(reg)">Show full reg</button>
        </td>
      </tr>
    </table>

    <p v-else>
      No regs with given spots
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatRoomPreference, sleepMillisec } from '../utils'
import registrationApi from '../api/registration-api'

export default {
  name: 'registrationsWithSpots',

  props: {
    'isOpen': Boolean,
  },

  computed: {
    ...mapGetters(['registrationsWithSpots', 'highlightedRegistrationId'])
  },

  data: function () {
    return {
      errorMessage: '',
    }
  },

  methods: {
    async removeSpotFromRegistration (reg) {
      let result = await registrationApi.removeSpotFromRegistration(reg.userId)

      if ('error' in result) {
        this.errorMessage = result.error
        this.scrollToErrorMessage()
      }
      else { 
        this.$store.dispatch('loadData')
      }
    },

    async highlightRegistration (reg) {
      if (!this.isAllRegistrationsOpen) {
        this.$store.commit('setIsAllRegistrationsOpen', true)
        await sleepMillisec(80)
      }

      this.$store.commit('setHighlightedRegistrationId', reg.id)
    },

    scrollToErrorMessage () {

    },

    formatRoomPreference,
  },
}
</script>