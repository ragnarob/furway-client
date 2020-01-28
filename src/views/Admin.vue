<template>
  <div class="flex-col">
    <h1>Admin</h1>

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
        <PendingRegistrations/>
      </div>

      <!-- Registrations with given spots -->
      <div>
        <h2 class="header-with-show-hide">
          Registrations with given spots
          <ShowIcon v-if="!isRegistrationsWithSpotsOpen" @click="isRegistrationsWithSpotsOpen = true" class="show-hide-icon"/>
          <HideIcon v-if="isRegistrationsWithSpotsOpen" @click="isRegistrationsWithSpotsOpen = false" class="show-hide-icon"/>
        </h2>
        <RegistrationsWithSpots :isOpen="isRegistrationsWithSpotsOpen"/>
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
          <ShowIcon v-if="!isAllRegistrationsOpen" @click="toggleIsAllRegistrationsOpen" class="show-hide-icon"/>
          <HideIcon v-if="isAllRegistrationsOpen" @click="toggleIsAllRegistrationsOpen" class="show-hide-icon"/>
        </h2>
        <RegistrationList/>
      </div>

      <!-- Deleted registrations -->
      <div>
        <h2 class="header-with-show-hide">
          Deleted Registrations
          <ShowIcon v-if="!isDeletedRegistrationsOpen" @click="toggleIsDeletedRegistrationsOpen" class="show-hide-icon"/>
          <HideIcon v-if="isDeletedRegistrationsOpen" @click="toggleIsDeletedRegistrationsOpen" class="show-hide-icon"/>
        </h2>
        <DeletedRegistrations :isOpen="isDeletedRegistrationsOpen"/>
      </div>

      <!-- All users -->
      <div>
        <h2 class="header-with-show-hide">
          All Users
          <ShowIcon v-if="!isAllUsersOpen" @click="toggleIsAllUsersOpen" class="show-hide-icon"/>
          <HideIcon v-if="isAllUsersOpen" @click="toggleIsAllUsersOpen" class="show-hide-icon"/>
        </h2>
        <UserList/>
      </div>

      <!-- Con info -->
      <div>
        <h2 class="header-with-show-hide">
          Con info manager
          <ShowIcon v-if="!isConInfoManagerOpen" @click="isConInfoManagerOpen = true" class="show-hide-icon"/>
          <HideIcon v-if="isConInfoManagerOpen" @click="isConInfoManagerOpen = false" class="show-hide-icon"/>
        </h2>
        <ConInfoManager :isOpen="isConInfoManagerOpen"/>
      </div>
    </div>

    <div v-if="$store.state.isLoggedIn && $store.state.userData.isDriver" style="max-width: 100%;">
        <h2 class="header-with-show-hide" v-if="$store.state.userData.isAdmin">
          Driving list
          <ShowIcon v-if="!isDrivingListOpenAdmin" @click="toggleIsDrivingListOpenAdmin" class="show-hide-icon"/>
          <HideIcon v-if="isDrivingListOpenAdmin" @click="toggleIsDrivingListOpenAdmin" class="show-hide-icon"/>
        </h2>
        <h2 v-else>
          Driving list
        </h2>
        <DrivingList :isOpen="isDrivingListOpen"/>
    </div>

    <div v-if="!$store.state.isLoggedIn || !($store.state.userData.isDriver || $store.state.userData.isAdmin)">
      Not logged in eller ikke admin/driver. Denne siden blir ikke vist engang i ferdig implementasjon, bare redirect til index.
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
import PendingRegistrations from '../components/PendingRegistrations.vue'
import DeletedRegistrations from '../components/DeletedRegistrations.vue'
import RegistrationsWithSpots from '../components/RegistrationsWithSpots.vue'
import ConInfoManager from '../components/ConInfoManager'
import DrivingList from '../components/DrivingList.vue'

import ShowIcon from 'vue-material-design-icons/Eye.vue'
import HideIcon from 'vue-material-design-icons/EyeOff.vue'

import { mapGetters } from 'vuex'


export default {
  name: 'admin',

  components: { UserList, RegistrationList, WaitingLists, AdminStats, PendingRegistrations, DeletedRegistrations, RegistrationsWithSpots, ConInfoManager, DrivingList, ShowIcon, HideIcon },

  data: function () {
    return {
      showWaitingLists: false,
      showAdminStats: false,
      isRegistrationsWithSpotsOpen: false,
      isConInfoManagerOpen: false,
      isDeletedRegistrationsOpen: false,
      isDrivingListOpenAdmin: false,
    }
  },

  async mounted () {
    if (this.$store.state.isLoggedIn) {
      this.loadAllAdminData()
    }
    else {
      this.$store.watch(() => this.$store.getters.isLoggedIn, this.loadAllAdminData)
    }
  },

  methods: {
    toggleIsAllUsersOpen () { this.$store.dispatch('toggleIsAllUsersOpen') },
    toggleIsAllRegistrationsOpen () { this.$store.dispatch('toggleIsAllRegistrationsOpen') },
    toggleIsDeletedRegistrationsOpen () { this.isDeletedRegistrationsOpen = !this.isDeletedRegistrationsOpen },
    toggleIsDrivingListOpenAdmin () { this.isDrivingListOpenAdmin = !this.isDrivingListOpenAdmin },

    async loadAllAdminData () {
      if (this.$store.state.isLoggedIn && this.$store.state.userData.isAdmin) {
        this.$store.dispatch('loadAllAdminData')
      }
    },

    formatRoomPreference (roomPreference) {
      if (roomPreference === 'insideonly') { return 'Inside only' }
      else if (roomPreference === 'outsideonly') { return 'Outside only' }
      else { return 'Inside preference' }
    },

    async createRegs (regType, amount) {
      await registrationApi.createOpRegs(regType, amount)
      this.$store.dispatch('loadAllAdminData')
    },

    toggleTimestampFormat () {
      this.$store.dispatch('toggleTimestampFormat')
    },
  },

  computed: {
    ...mapGetters(['isAllUsersOpen', 'isAllRegistrationsOpen']),

    isDrivingListOpen () {
      return this.$store.state.userData.isAdmin
        ? this.isDrivingListOpenAdmin 
        : true
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
  @media screen and (min-width: 849px) {
    padding-left: 16px;
  }
}
</style>