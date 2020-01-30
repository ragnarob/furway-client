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
            <span v-if="reg.earlyArrival">Early</span>
            <span v-if="reg.lateDeparture">Late</span>
          </span>
        </td>

        <td>
          <span class="flex-col">
            <span v-if="reg.buyHoodie">Hoodie, {{reg.hoodieSize}}</span>
            <span v-if="reg.buyTshirt">T-shirt, {{reg.tshirtSize}}</span>
          </span>
        </td>

        <td>{{reg.paidAmount}} paid, {{reg.totalAmount}} total</td>

        <td>
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