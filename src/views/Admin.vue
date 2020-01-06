<template>
  <div class="flex-col">
    <h1>Admin</h1>

    <p class="error-message" id="adminErrorMessage" v-show="errorMessage">{{errorMessage}}</p>


    <div v-if="$store.state.isLoggedIn && $store.state.userData.isAdmin" style="max-width: 100%;">
      <p @click="toggleTimestampFormat" class="link-text">Toggle timestamp format</p>

      <!-- Jukseknapper-div -->
      <div style="text-align: left;" id="temp-op-div">
        <button @click="createRegs('insideonly', 1)">Lag 1 bruker og inside-only regs</button>
        <button @click="createRegs('insideonly', 2)">Lag 2 brukere og inside-only regs</button>
        <button @click="createRegs('insideonly', 10)">Lag 10 brukere og inside-only regs</button>
        <br>
        <button @click="createRegs('insidepreference', 1)">Lag 1 bruker og inside-preference regs</button>
        <button @click="createRegs('insidepreference', 2)">Lag 2 brukere og inside-preference regs</button>
        <button @click="createRegs('insidepreference', 10)">Lag 10 brukere og inside-preference regs</button>
        <br>
        <button @click="createRegs('outsideonly', 1)">Lag 1 bruker og outside-only regs</button>
        <button @click="createRegs('outsideonly', 2)">Lag 2 brukere og outside-only regs</button>
        <button @click="createRegs('outsideonly', 10)">Lag 10 brukere og outside-only regs</button>
      </div>
      
      <!-- Numbers & dates -->
      <div>
        <h2 class="header-with-show-hide">
          Numbers & dates
          <ShowIcon v-if="!showAdminStats" @click="showAdminStats = true" class="show-hide-icon"/>
          <HideIcon v-if="showAdminStats" @click="showAdminStats = false" class="show-hide-icon"/>
        </h2>

        <AdminStats :isOpen="showAdminStats"/>
      </div>

      <!-- Pending registrations -->
      <div>
        <h2>Pending registrations</h2>
        <table>
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
            <td>{{formatTimestamp(reg.timestamp)}}</td>
            <td>
              <button @click="approveRegistration(reg)">Approve</button>
              <button @click="rejectRegistration(reg)">Reject</button>
              <button @click="highlightUser(reg.username)">Show full user</button>
            </td>
          </tr>
        </table>
      </div>

      <!-- Registrations with given spots -->
      <div>
        <h2 class="header-with-show-hide">
          Registrations with given spots
          <ShowIcon v-if="!showRegistrationsWithSpots" @click="showRegistrationsWithSpots = true" class="show-hide-icon"/>
          <HideIcon v-if="showRegistrationsWithSpots" @click="showRegistrationsWithSpots = false" class="show-hide-icon"/>
        </h2>
        <table v-show="showRegistrationsWithSpots">
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
          <tr v-for="reg in givenRegistrations" :key="reg.id" :class="{'highlighted-row-blue': reg.id === highlightedRegistrationId}">
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
      </div>

      <!-- Waiting lists -->
      <div>
        <h2 class="header-with-show-hide">
          Waiting lists
          <ShowIcon v-if="!showWaitingLists" @click="showWaitingLists = true" class="show-hide-icon"/>
          <HideIcon v-if="showWaitingLists" @click="showWaitingLists = false" class="show-hide-icon"/>
        </h2>

        <WaitingLists :isOpen="showWaitingLists" :isInAdminPanel="true"/>
      </div>

      <!-- All registrations -->
      <div>
        <h2 class="header-with-show-hide">
          All Registrations
          <ShowIcon v-if="!isAllRegistrationsOpen" @click="isAllRegistrationsOpen = true" class="show-hide-icon"/>
          <HideIcon v-if="isAllRegistrationsOpen" @click="isAllRegistrationsOpen = false" class="show-hide-icon"/>
        </h2>
        <RegistrationList :isOpen="isAllRegistrationsOpen"/>
      </div>

      <!-- All users -->
      <div>
        <h2 class="header-with-show-hide">
          All Users
          <ShowIcon v-if="!isAllUsersOpen" @click="isAllUsersOpen = true" class="show-hide-icon"/>
          <HideIcon v-if="isAllUsersOpen" @click="isAllUsersOpen = false" class="show-hide-icon"/>
        </h2>
        <UserList :isOpen="isAllUsersOpen"/>
      </div>
    </div>

    <div v-else>
      Not logged in eller ikke admin. Denne siden blir ikke vist engang i ferdig implementasjon, bare redirect til index.
    </div>
  </div>
</template>

<script>
import registrationApi from '../api/registration-api'
import userApi from '../api/user-api'
import UserList from '../components/UserList.vue'
import RegistrationList from '../components/RegistrationList.vue'
import WaitingLists from '../components/WaitingLists.vue'
import AdminStats from '../components/AdminStats.vue'
import ShowIcon from 'vue-material-design-icons/Eye.vue'
import HideIcon from 'vue-material-design-icons/EyeOff.vue'


export default {
  name: 'admin',

  components: { UserList, RegistrationList, WaitingLists, AdminStats, ShowIcon, HideIcon },

  data: function () {
    return {
      errorMessage: '',
      allRegistrations: [],
      pendingRegistrations: [],
      allUsers: [],
      waitingLists: {inside: [], outside: []},
      timestampFormat: 'short',
      highlightedRegistrationId: null,
      highlightedUsername: null,
      isAllRegistrationsOpen: false,
      isAllUsersOpen: false,
      showRegistrationsWithSpots: false,
      showWaitingLists: false,
      showAdminStats: true,
      usernamesWithReceivedRooms: [],
    }
  },

  async mounted () {
    this.$store.dispatch('loadData')
  },

  methods: {
    formatRoomPreference (roomPreference) {
      if (roomPreference === 'insideonly') { return 'Inside only' }
      else if (roomPreference === 'outsideonly') { return 'Outside only' }
      else { return 'Inside preference' }
    },

    async createRegs (regType, amount) {
      await registrationApi.createOpRegs(regType, amount)
      this.$store.dispatch('loadData')
    },

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
        this.isAllRegistrationsOpen = true
        await this.sleepMillisec(80)
      }

      this.$store.commit('setHighlightedRegistrationId', reg.id)
    },

    async highlightUser (username) {
      if (!this.isAllUsersOpen) {
        this.isAllUsersOpen = true
        await this.sleepMillisec(80)
      }

      this.$store.commit('setHighlightedUsername', username)
    },

    toggleTimestampFormat () {
      this.timestampFormat = this.timestampFormat==='short' ? 'long' : 'short'
    },

    formatTimestamp (timestamp) {
      return this.timestampFormat === 'short' ? this.formatShortTimestamp(timestamp) : this.formatLongTimestamp(timestamp)
    },

    formatShortTimestamp (timestamp) {
      return new Date(timestamp).toDateString().substr(4,6)
    },

    formatLongTimestamp (timestamp) {
      let tsDate = new Date(timestamp)
      return tsDate.toDateString().substr(4,6) + ', ' + tsDate.toTimeString().substr(0,8)
    },

    formatBdayTimestamp (timestamp) {
      return new Date(timestamp).toDateString().substr(4,11)
    },

    scrollToErrorMessage () {
      document.getElementById('adminErrorMessage').scrollIntoView()
    },

    sleepMillisec (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },

  computed: {
    givenRegistrations () {
      return this.allRegistrations.filter(reg => reg.receivedInsideSpot || reg.receivedOutsideSpot)
    },
  }
}
</script>

<style lang="scss" scoped>
#temp-op-div {
  button {
    padding: 6px 4px;
    margin-bottom: 4px;
  }
}
.show-hide-span {
  font-size: 14px;
}
.header-with-show-hide {
  padding-left: 16px;
}
</style>