<template>
  <div class="flex-col">
    <h1>Admin</h1>

    <p class="error-message" id="adminErrorMessage" v-show="errorMessage">{{errorMessage}}</p>


    <div v-if="$store.state.isLoggedIn && $store.state.userData.isAdmin" style="max-width: 100%;">
      <p @click="toggleTimestampFormat" class="link-text">Toggle timestamp format</p>

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
      
      <div>
        <h2>Numbers & dates</h2>
        <table id="numbersTable">
          <tr>
            <td>Users</td>
            <td>{{allUsers.length}} users, {{usersWithRegistration}} with reg</td>
          </tr>
          <tr>
            <td>Registrations</td>
            <td>{{allRegistrations.length}}</td>
          </tr>
          <tr>
            <td>Approved registrations</td>
            <td>{{numberOfApprovedRegistrations}}</td>
          </tr>
          <tr>
            <td>Registrations with spot</td>
            <td>{{numberOfRegistrationsGiven}}</td>
          </tr>
          <tr>
            <td>Inside spots</td>
            <td>{{numberOfInsideRegistrationsGiven}}/{{conInfo.numberOfInsideSpots}} spots, {{waitingLists.inside.length}} waiting</td>
          </tr>
          <tr>
            <td>Outside spots</td>
            <td>{{numberOfOutsideRegistrationsGiven}}/{{conInfo.numberOfOutsideSpots}} spots, {{waitingLists.outside.length}} waiting</td>
          </tr>

          <br> 

          <tr>
            <td>Fully paid registrations</td>
            <td>{{numberOfFullyPaidRegistrations}} / {{numberOfRegistrationsGiven}}</td>
          </tr>
          <tr>
            <td>Main days paid, add-ons unpaid regs</td>
            <td>{{numberOfOnlyAddonsUnpaidRegistrations}} / {{numberOfRegistrationsGiven}}</td>
          </tr>
          <tr>
            <td>Fully unpaid registrations</td>
            <td>{{numberOfRegistrationsGiven - numberOfMainDaysPaidRegistrations}} / {{numberOfRegistrationsGiven}}</td>
          </tr>

          <br>

          <tr>
            <td>Registration opening date</td>
            <td>{{formatShortTimestamp(conInfo.registrationOpenDate)}} (volunteers: {{formatShortTimestamp(conInfo.volunteerRegistrationOpenDate)}})</td>
          </tr>
          <tr>
            <td>Registration close date</td>
            <td>{{formatShortTimestamp(conInfo.registrationCloseDate)}}</td>
          </tr>
          <tr>
            <td>Soft Main payment deadline</td>
            <td>{{formatShortTimestamp(conInfo.originalPaymentDeadline)}}</td>
          </tr>
          <tr>
            <td>Final main payment deadline</td>
            <td>{{formatShortTimestamp(conInfo.finalRegPaymentDeadline)}}</td>
          </tr>
          <tr>
            <td>Merch, early & late payment deadline</td>
            <td>{{formatShortTimestamp(conInfo.addonPaymentDeadline)}}</td>
          </tr>

          <br>

          <tr>
            <td>Main days price</td>
            <td>{{conInfo.mainDaysPriceNok}}</td>
          </tr>
          <tr>
            <td>Early/late price</td>
            <td>{{conInfo.earlyArrivalPriceNok}}/{{conInfo.lateDeparturePriceNok}}</td>
          </tr>
          <tr v-if="conInfo.isSellingHoodies">
            <td>Hoodie price</td>
            <td>{{conInfo.hoodiePriceNok}}</td>
          </tr>
          <tr v-if="conInfo.isSellingTshirts">
            <td>T-shirt price</td>
            <td>{{conInfo.tshirtPriceNok}}</td>
          </tr>

          <br>

          <tr v-if="conInfo.isSellingHoodies">
            <td>Hoodies, total</td>
            <td>
              <span v-for="(count, size) in numberOfMerch.hoodies.total" :key="size" style="margin-right: 6px;">
                {{size}}: {{count}}
              </span> 
            </td>
          </tr>

          <tr v-if="conInfo.isSellingHoodies">
            <td>Hoodies, paid</td>
            <td>
              <span v-for="(count, size) in numberOfMerch.hoodies.paid" :key="size" style="margin-right: 6px;">
                {{size}}: {{count}}
              </span> 
            </td>
          </tr>

          <tr v-if="conInfo.isSellingTshirts">
            <td>T-shirts, total</td>
            <td>
              <span v-for="(count, size) in numberOfMerch.tshirts.total" :key="size" style="margin-right: 6px;">
                {{size}}: {{count}}
              </span> 
            </td>
          </tr>

          <tr v-if="conInfo.isSellingTshirts">
            <td>T-shirts, paid</td>
            <td>
              <span v-for="(count, size) in numberOfMerch.tshirts.paid" :key="size" style="margin-right: 6px;">
                {{size}}: {{count}}
              </span> 
            </td>
          </tr>

          <br>

          <tr>
            <td>Number of vegans</td>
            <td>TODO</td>
          </tr>
          <tr>
            <td>Number of fursuiters</td>
            <td>TODO 2</td>
          </tr>
        </table>
      </div>

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
          <tr v-for="reg in pendingRegistrations" :key="reg.id" :class="{'highlighted-row': reg.username === highlightedUserName}">
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

      <div>
        <h2>
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

      <div>
        <h2>
          Waiting lists
          <ShowIcon v-if="!showWaitingLists" @click="showWaitingLists = true" class="show-hide-icon"/>
          <HideIcon v-if="showWaitingLists" @click="showWaitingLists = false" class="show-hide-icon"/>
        </h2>

        <WaitingLists :isOpen="showWaitingLists" :waitingLists="waitingLists" :timestampFormat="timestampFormat"/>
      </div>

      <div>
        <h2>
          All Registrations
          <ShowIcon v-if="!isAllRegistrationsOpen" @click="isAllRegistrationsOpen = true" class="show-hide-icon"/>
          <HideIcon v-if="isAllRegistrationsOpen" @click="isAllRegistrationsOpen = false" class="show-hide-icon"/>
        </h2>
        <RegistrationList :isOpen="isAllRegistrationsOpen" :allRegistrations="allRegistrations" :timestampFormat="timestampFormat" :highlightedRegistrationId="highlightedRegistrationId"/>
      </div>

      <div>
        <h2>
          All Users
          <ShowIcon v-if="!isAllUsersOpen" @click="isAllUsersOpen = true" class="show-hide-icon"/>
          <HideIcon v-if="isAllUsersOpen" @click="isAllUsersOpen = false" class="show-hide-icon"/>
        </h2>
        <UserList :isOpen="isAllUsersOpen" :allUsers="allUsers" :highlightedUserName="highlightedUserName" :usernamesWithReceivedRooms="usernamesWithReceivedRooms"/>
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
import { mapGetters } from 'vuex'
import UserList from '../components/UserList.vue'
import RegistrationList from '../components/RegistrationList.vue'
import WaitingLists from '../components/WaitingLists.vue'
import ShowIcon from 'vue-material-design-icons/Eye.vue'
import HideIcon from 'vue-material-design-icons/EyeOff.vue'


export default {
  name: 'admin',

  components: { UserList, RegistrationList, WaitingLists, ShowIcon, HideIcon },

  data: function () {
    return {
      errorMessage: '',
      allRegistrations: [],
      pendingRegistrations: [],
      allUsers: [],
      waitingLists: {inside: [], outside: []},
      timestampFormat: 'short',
      highlightedRegistrationId: null,
      highlightedUserName: null,
      isAllRegistrationsOpen: false,
      isAllUsersOpen: false,
      showRegistrationsWithSpots: false,
      showWaitingLists: false,
      usernamesWithReceivedRooms: [],
    }
  },

  async mounted () {
    this.loadData()
  },

  methods: {
    formatRoomPreference (roomPreference) {
      if (roomPreference === 'insideonly') { return 'Inside only' }
      else if (roomPreference === 'outsideonly') { return 'Outside only' }
      else { return 'Inside preference' }
    },

    async createRegs (regType, amount) {
      await registrationApi.createOpRegs(regType, amount)
      this.loadData()
    },

    async loadData () {
      this.allRegistrations = await registrationApi.getAllRegistrations()
      this.pendingRegistrations = await registrationApi.getPendingRegistrations()
      this.allUsers = await userApi.getAllUsers()
      this.waitingLists = await registrationApi.getWaitingLists()

      this.calculateUsersWithReceivedRooms()
    },

    calculateUsersWithReceivedRooms () {
      this.usernamesWithReceivedRooms = this.allRegistrations
        .filter(reg => reg.receivedInsideSpot || reg.receivedOutsideSpot)
        .map(reg => reg.username)
    },

    async approveRegistration (reg) {
      let result = await registrationApi.approveRegistration(reg.userId)

      if ('error' in result) {
        this.errorMessage = result.error
        this.scrollToErrorMessage()
      }
      else {
        this.loadData()
      }
    },
    
    async rejectRegistration (reg) {
      let result = await registrationApi.rejectRegistration(reg.userId)

      if ('error' in result) {
        this.errorMessage = result.error
        this.scrollToErrorMessage()
      }
      else {
        this.loadData()
      }
    },

    async removeSpotFromRegistration (reg) {
      let result = await registrationApi.removeSpotFromRegistration(reg.userId)

      if ('error' in result) {
        this.errorMessage = result.error
        this.scrollToErrorMessage()
      }
      else {
        this.loadData()
      }
    },

    async highlightRegistration (reg) {
      if (!this.isAllRegistrationsOpen) {
        this.isAllRegistrationsOpen = true
        await this.sleepMillisec(80)
      }
      this.highlightedRegistrationId = reg.id
    },

    async highlightUser (username) {
      if (!this.isAllUsersOpen) {
        this.isAllUsersOpen = true
        await this.sleepMillisec(80)
      }
      this.highlightedUserName = username
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
    ...mapGetters(['myRegistration', 'conInfo']),

    givenRegistrations () {
      return this.allRegistrations.filter(reg => reg.receivedInsideSpot || reg.receivedOutsideSpot)
    },
    
    numberOfInsideRegistrationsGiven () {
      return this.allRegistrations.filter(reg => reg.receivedInsideSpot === true).length
    },

    numberOfOutsideRegistrationsGiven () {
      return this.allRegistrations.filter(reg => reg.receivedOutsideSpot === true).length
    },

    numberOfRegistrationsGiven () {
      return this.numberOfInsideRegistrationsGiven + this.numberOfOutsideRegistrationsGiven
    },

    numberOfApprovedRegistrations () {
      return this.allRegistrations.filter(reg => reg.isAdminApproved === true).length
    },

    usersWithRegistration () {
      return this.allUsers.filter(user => user.registrationId !== null).length
    },

    numberOfMainDaysPaidRegistrations () {
      return this.allRegistrations.filter(reg => reg.isMainDaysPaid === true).length
    },

    numberOfFullyPaidRegistrations () {
      return this.allRegistrations.filter(reg => reg.isMainDaysPaid === true && reg.isAddonsPaid === true).length
    },

    numberOfOnlyAddonsUnpaidRegistrations () {
      return this.allRegistrations.filter(reg => reg.isMainDaysPaid === true && reg.isAddonsPaid === false).length
    },

    numberOfMerch () {
      let paidHoodieCounts = {}
      let totalHoodieCounts = {}
      let paidTshirtCounts = {}
      let totalTshirtCounts = {}

      for (var reg of this.allRegistrations) {
        if (reg.buyHoodie === true) {
          let size = reg.hoodieSize
          totalHoodieCounts[size] = ++totalHoodieCounts[size] || 1
          if (reg.isHoodiePaid) {
            paidHoodieCounts[size] = ++paidHoodieCounts[size] || 1
          }
        }

        if (reg.buyTshirt === true) {
          let size = reg.tshirtSize
          totalTshirtCounts[size] = ++totalTshirtCounts[size] || 1
          if (reg.isTshirtPaid) {
            paidTshirtCounts[size] = ++paidTshirtCounts[size] || 1
          }
        }
      }

      return {
        hoodies: {
          total: totalHoodieCounts,
          paid: paidHoodieCounts
        },
        tshirts: {
          total: totalTshirtCounts,
          paid: paidTshirtCounts
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
#numbersTable {
  border: none;
  td {
    text-align: left;
    border: none;
  }
  td:first-child {
    text-align: right;
    padding-right: 8px;
  }
}
#temp-op-div {
  button {
    padding: 6px 4px;
    margin-bottom: 4px;
  }
}
.show-hide-span {
  font-size: 14px;
}
</style>