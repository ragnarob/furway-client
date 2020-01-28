<template>
  <div style="width: 100%;" v-show="isAllUsersOpen">

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"/>

    <div style="margin-bottom: 8px; justify-content: center;" class="flex-row">
      <div style="display: flex; align-items: center;">
        <input type="checkbox" v-model="shouldFilterList" id="onlyReceivedSpotsCheckbox">
        <label for="onlyReceivedSpotsCheckbox">Only show users with received spots</label>
      </div>

      <div style="margin-left: 40px;">
        <button @click="generateUserTextDocument">Export users with received spots to file</button>
      </div>
    </div>

    <table class="very-wide-table">
      <tr>
        <th>Action</th>
        <th>Username</th>
        <th title="Has a registration?">Reg</th>
        <th>First name</th>
        <th>Last name</th>
        <th>Email</th>
        <th>Date of birth</th>
        <th title="Telegram username">Telegram</th>
        <th>Phone</th>
        <th>Vegan</th>
        <th>Fursuiter</th>
        <th>Allergies</th>
        <th>Addr. line 1</th>
        <th>Addr. line 2</th>
        <th>Zip code and area</th>
        <th>State</th>
        <th>Country</th>
        <th>Pickup</th>
        <th>Pickup time</th>
        <th>Additional info</th>
        <th title="Is volunteer?">Volunt.</th>
        <th>Driver</th>
        <th>Admin</th>
      </tr>
      <tr v-for="user in userListToUse" :key="user.id" :class="{'highlighted-row': user.username === highlightedUsername}">
        <td>
          <!-- DEFAULT -->
          <button v-if="userBeingEdited === null && userIdToBeDeleted === null" @click="editUser(user.id)" class="icon-button icon-button-small neutral-button">
            <EditIcon title="Edit"/>
          </button>
          <button v-if="userBeingEdited === null && userIdToBeDeleted === null" @click="setUserToBeDeleted(user.id)" class="icon-button icon-button-small neutral-button">
            <DeleteIcon title="Delete"/>
          </button>

          <!-- EDIT -->
          <button v-if="isThisUserBeingEdited(user.id)" @click="cancelEditing()" class="icon-button icon-button-small neutral-button">
            <CancelIcon title="Cancel"/>
          </button>
          <button v-if="isThisUserBeingEdited(user.id)" @click="saveUser()" class="icon-button icon-button-small theme-button">
            <SaveIcon title="Save"/>
          </button>

          <!-- DELETE -->
          <button v-if="isThisUserBeingDeleted(user.id)" @click="cancelDeleting()" class="neutral-button big-button">
            Cancel <DeleteIcon title="Delete"/>
          </button>
          <button v-if="isThisUserBeingDeleted(user.id)" @click="confirmDeleteUser()" class="danger-button big-button">
            Confirm <FilledDeleteIcon title="Delete"/>
          </button>
        </td>

        <td>
          <p :class="{'non-editable-cell': isThisUserBeingEdited(user.id), 'username-cell': true}">
            {{user.username}}
          </p>
        </td>

        <td>
          <p :class="{'non-editable-cell': isThisUserBeingEdited(user.id)}">
            <YesIcon v-if="user.registrationId !== null"/>
            <NoIcon v-else/>
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.firstName"/>
          </p>
          <p v-else>
            {{user.firstName}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.lastName"/>
          </p>
          <p v-else>
            {{user.lastName}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="email" v-model="userBeingEdited.email" style="width: 150px;"/>
          </p>
          <p v-else>
            {{user.email}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="date" v-model="userBeingEdited.dateOfBirth"/>
          </p>
          <p v-else>
            {{formatBdayTimestamp(user.dateOfBirth)}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.telegramUsername"/>
          </p>
          <p v-else>
            {{user.telegramUsername}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.phone"/>
          </p>
          <p v-else>
            {{user.phone}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.isVegan" :value="true" id="isVeganTrue"/>
            <label for="isVeganTrue">Yes</label>
            <input type="radio" v-model="userBeingEdited.isVegan" :value="false" id="isVeganFalse"/>
            <label for="isVeganFalse">No</label>
          </p>
          <p v-else>
            <YesIcon v-if="user.isVegan"/>
            <NoIcon v-else-if="user.isVegan === false"/>
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.isFursuiter" :value="true" id="isFursuiterTrue"/>
            <label for="isFursuiterTrue">Yes</label>
            <input type="radio" v-model="userBeingEdited.isFursuiter" :value="false" id="isFursuiterFalse"/>
            <label for="isFursuiterFalse">No</label>
          </p>
          <p v-else>
            <YesIcon v-if="user.isFursuiter"/>
            <NoIcon v-else-if="user.isFursuiter === false"/>
          </p>
        </td>

        <td long-text-cell>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.allergiesText"/>
          </p>
          <p v-else>
            {{user.allergiesText}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.addressLine1"/>
          </p>
          <p v-else>
            {{user.addressLine1}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.addressLine2"/>
          </p>
          <p v-else>
            {{user.addressLine2}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.addressCity"/>
          </p>
          <p v-else>
            {{user.addressCity}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.addressStateProvince"/>
          </p>
          <p v-else>
            {{user.addressStateProvince}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input type="text" v-model="userBeingEdited.addressCountry"/>
          </p>
          <p v-else>
            {{user.addressCountry}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.pickupType" :value="'bus'" id="pickupTypeBus"/>
            <label for="pickupTypeBus">Bus</label>
            <input type="radio" v-model="userBeingEdited.pickupType" :value="'train'" id="pickupTypeTrain"/>
            <label for="pickupTypeTrain">Train</label>
            <input type="radio" v-model="userBeingEdited.pickupType" :value="null" id="pickupTypeNo"/>
            <label for="pickupTypeNo">No</label>
          </p>
          <p v-else-if="user.pickupType !== null">
            {{user.pickupType}}
          </p>
          <NoIcon v-else />
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)">
            <input v-if="userBeingEdited.pickupType !== null" type="datetime-local" v-model="userBeingEdited.pickupTime"/>
            <span v-else>-</span>
          </p>
          <p v-else>
            {{formatDateTimeWithoutYear(user.pickupTime)}}
          </p>
        </td>

        <td class="long-text-cell">
          <textarea v-if="isThisUserBeingEdited(user.id)" type="text" v-model="userBeingEdited.additionalInfo"/>
          <div v-else style="max-width: 100%;">
            {{user.additionalInfo}}
          </div>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.isVolunteer" :value="true" id="isVolunteerTrue"/>
            <label for="isVolunteerTrue">Yes</label>
            <input type="radio" v-model="userBeingEdited.isVolunteer" :value="false" id="isVolunteerFalse"/>
            <label for="isVolunteerFalse">No</label>
          </p>
          <p v-else>
            <YesIcon v-if="user.isVolunteer"/>
            <NoIcon v-else-if="user.isVolunteer === false"/>
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.isDriver" :value="true" id="isDriverTrue"/>
            <label for="isDriverTrue">Yes</label>
            <input type="radio" v-model="userBeingEdited.isDriver" :value="false" id="isDriverFalse"/>
            <label for="isDriverFalse">No</label>
          </p>
          <p v-else>
            <YesIcon v-if="user.isDriver"/>
            <NoIcon v-else-if="user.isDriver === false"/>
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.isAdmin" :value="true" id="isAdminTrue"/>
            <label for="isAdminTrue">Yes</label>
            <input type="radio" v-model="userBeingEdited.isAdmin" :value="false" id="isAdminFalse"/>
            <label for="isAdminFalse">No</label>
          </p>
          <p v-else>
            <YesIcon v-if="user.isAdmin"/>
            <NoIcon v-else-if="user.isAdmin === false"/>
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import userApi from '../api/user-api'

import YesIcon from 'vue-material-design-icons/CheckCircle.vue'
import NoIcon from 'vue-material-design-icons/Close.vue'
import EditIcon from 'vue-material-design-icons/Pencil.vue'
import SaveIcon from 'vue-material-design-icons/ContentSave.vue'
import CancelIcon from 'vue-material-design-icons/Close.vue'
import DeleteIcon from 'vue-material-design-icons/DeleteOutline.vue'
import FilledDeleteIcon from 'vue-material-design-icons/Delete.vue'

import ResponseMessage from './ResponseMessage.vue'
import { mapGetters } from 'vuex'

export default {
  props: {
    isOpen: Boolean,
  },

  components: {
    ResponseMessage,
    YesIcon, NoIcon, EditIcon, SaveIcon, CancelIcon, DeleteIcon, FilledDeleteIcon
  },

  data: function () {
    return {
      userBeingEdited: null,
      shouldFilterList: false,
      responseMessage: null,
      responseMessageType: 'info',
      userIdToBeDeleted: null,
    }
  },

  computed: {
    ...mapGetters(['allUsers', 'highlightedUsername', 'usernamesWithReceivedRooms', 'isAllUsersOpen']),

    userListToUse () {
      return this.shouldFilterList ? this.filteredUsers : this.allUsers
    },

    filteredUsers () {
      return this.allUsers.filter(user => this.usernamesWithReceivedRooms.find(username => username === user.username) !== undefined)
    }
  },

  methods: {
    isThisUserBeingEdited (userId) {
      return this.userBeingEdited !== null && this.userBeingEdited.id === userId
    },

    isThisUserBeingDeleted (userId) {
      return this.userIdToBeDeleted !== null && this.userIdToBeDeleted === userId
    },

    editUser (userId) {
      this.userBeingEdited = {...this.allUsers.find(u => u.id === userId)}
      this.userBeingEdited.dateOfBirth = this.userBeingEdited.dateOfBirth ? this.userBeingEdited.dateOfBirth.toLocalISOString().substr(0,10) : null
      this.userBeingEdited.pickupTime = this.userBeingEdited.pickupTime ? this.userBeingEdited.pickupTime.toLocalISOString() : null
    },

    cancelEditing () {
      this.userBeingEdited = null
    },

    setUserToBeDeleted (userId) {
      this.userIdToBeDeleted = userId
    },

    async confirmDeleteUser () {
      let response = await userApi.deleteUser(this.userIdToBeDeleted)

      if ('error' in response) {
        this.responseMessage = response['error']
        this.responseMessageType = 'error'
      }
      else {
        this.responseMessage = `User deleted successfully`
        this.responseMessageType = 'success'
        this.cancelDeleting()
        this.$store.dispatch('loadAllAdminData')
      }
    },

    cancelDeleting () {
      this.userIdToBeDeleted = null
    },

    async saveUser () {
      this.responseMessage = 'Saving user...'
      this.responseMessageType = 'info'

      let result = await userApi.saveUserAsAdmin(this.userBeingEdited.id, this.userBeingEdited)

      if ('error' in result) {
        this.responseMessage = result['error']
        this.responseMessageType = 'error'
      }
      else {
        this.responseMessage = `User ${this.userBeingEdited.username} successfully`
        this.responseMessageType = 'success'
        this.cancelEditing()
        this.$store.dispatch('loadAllAdminData')
      }
    },

    generateUserTextDocument () {
      let FileSaver = require('file-saver')
      let fileText = ''
      for (let user of this.filteredUsers) {
        fileText += `${user.firstName} ${user.lastName}; ${user.phone}; ${this.formatBdayTimestamp(user.dateOfBirth)}; ${user.addressLine1}${user.addressLine2 ? ', '+user.addressLine2 : ''}, ${user.addressStateProvince} ${user.addressCity}, ${user.addressCountry}\n`
      }

      let blob = new Blob([fileText], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "Furway-deltakere.txt");
    },

    formatBdayTimestamp (timestamp) {
      return new Date(timestamp).toDateString().substr(4,11)
    },

    formatDateTimeWithoutYear (dateTime) {
      return dateTime===null ? '' : dateTime.toDateString().substring(0,10) + ', ' + dateTime.toTimeString().substring(0,5)
    },

    closeResponseMessage () {
      this.responseMessage = ''
    },
  },

  watch: {
    highlightedUsername: function (newVal, oldVal) {
      if (newVal === null) { return }
      let usernameElements = document.getElementsByClassName('username-cell')
      for (var element of usernameElements) {
        if (element.textContent.trim() === newVal) {
          element.parentElement.scrollIntoView(true)
        }
      }
    },
  }
}
</script>
