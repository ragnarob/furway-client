<template>
  <div style="width: 100%;" v-show="isAllUsersOpen">

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
        <th>First name</th>
        <th>Last name</th>
        <th>Email</th>
        <th>Date of birth</th>
        <th>Phone</th>
        <th>Vegan</th>
        <th>Fursuiter</th>
        <th>Allergies</th>
        <th>Addr. 1</th>
        <th>Addr. 2</th>
        <th>Zip code and area</th>
        <th>State</th>
        <th>Country</th>
        <th>Pickup</th>
        <th>Pickup time</th>
        <th>Additional info</th>
        <th>Volunteer</th>
        <th>Admin</th>
      </tr>
      <tr v-for="user in userListToUse" :key="user.id" :class="{'highlighted-row': user.username === highlightedUsername}">
        <td>
          <button v-if="userBeingEdited === null" @click="editUser(user.id)" class="icon-button icon-button-small neutral-button">
            <EditIcon title="Edit"/>
          </button>
          <button v-if="userBeingEdited === null" @click="deleteUser(user.id)" class="icon-button icon-button-small neutral-button">
            <DeleteIcon title="Delete"/>
          </button>

          <button v-if="isThisUserBeingEdited(user.id)" @click="cancelEditing()" class="icon-button icon-button-small neutral-button">
            <CancelIcon title="Cancel"/>
          </button>
          <button v-if="isThisUserBeingEdited(user.id)" @click="saveUser()" class="icon-button icon-button-small theme-button">
            <SaveIcon title="Save"/>
          </button>
        </td>

        <td>
          <p :class="{'non-editable-cell': isThisUserBeingEdited(user.id), 'username-cell': true}">
            {{user.username}}
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
            <input type="text" v-model="userBeingEdited.phone"/>
          </p>
          <p v-else>
            {{user.phone}}
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.isVegan" value="true"/> true
            <input type="radio" v-model="userBeingEdited.isVegan" value="false"/> false
          </p>
          <p v-else>
            <YesIcon v-if="user.isVegan"/>
            <NoIcon v-else-if="user.isVegan === false"/>
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.isFursuiter" value="true"/> true
            <input type="radio" v-model="userBeingEdited.isFursuiter" value="false"/> false
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
          <input v-if="isThisUserBeingEdited(user.id)" type="text" v-model="userBeingEdited.additionalInfo"/>
          <div v-else style="max-width: 100%;">
            {{user.additionalInfo}}
          </div>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.isVolunteer" :value="true"/> true
            <input type="radio" v-model="userBeingEdited.isVolunteer" :value="false"/> false
          </p>
          <p v-else>
            <YesIcon v-if="user.isVolunteer"/>
            <NoIcon v-else-if="user.isVolunteer === false"/>
          </p>
        </td>

        <td>
          <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
            <input type="radio" v-model="userBeingEdited.isAdmin" value="true"/> true
            <input type="radio" v-model="userBeingEdited.isAdmin" value="false"/> false
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

import ResponseMessage from './ResponseMessage.vue'
import { mapGetters } from 'vuex'

export default {
  props: {
    isOpen: Boolean,
  },

  components: {
    ResponseMessage,
    YesIcon, NoIcon, EditIcon, SaveIcon, CancelIcon, DeleteIcon
  },

  data: function () {
    return {
      userBeingEdited: null,
      shouldFilterList: false,
      errorMessage: null,
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

    editUser (userId) {
      this.userBeingEdited = {...this.allUsers.find(u => u.id === userId)}
      this.userBeingEdited.dateOfBirth = new Date(this.userBeingEdited.dateOfBirth).toISOString().substr(0,10)
    },

    deleteUser (userId) {
      alert('delete user')
    },

    cancelEditing () {
      this.userBeingEdited = null
    },

    async saveUser () {
      let result = await userApi.saveEditedUser(this.userBeingEdited)

      if ('error' in result) {
        this.errorMessage = result.error
      }
      else {
        this.cancelEditing()
        this.$emit('loadData')
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
