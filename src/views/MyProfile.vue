<template>
  <div>
    <p v-if="!$store.state.isLoggedIn" class="margin-top-20">
      Not logged in.
    </p>

    <span v-else>
      <h1>User page: {{$store.state.userData.username}}</h1>

      <p>You can edit your user profile without your registration and waiting list positions being affected.</p>

      <ResponseMessage :message="responseMessage" :messageType="messageType" @closeMessage="closeResponseMessage" v-if="responseMessage"/>
      <LoadingMessage :message="'Processing...'" v-if="isUpdatingData"/>

      <div style="margin-top: 10px; margin-bottom: 10px;">
        <button @click="startEditing" v-show="!isEditingProfile && !isChangingPassword" class="big-button neutral-button double-button">
          <EditIcon title/>Edit profile
        </button>
        <button @click="startChangingPassword" v-show="!isEditingProfile && !isChangingPassword" class="big-button neutral-button margin-left-10">
          Change password
        </button>

        <button @click="cancelEditing" v-show="isEditingProfile" class="big-button neutral-button double-button">
          <CancelIcon title=""/>Cancel editing
        </button>
        <button @click="confirmEditing" v-show="isEditingProfile" :class="{'big-button': true, 'theme-button': canSave, 'disabled-button': !canSave, 'margin-left-10': true, 'double-button': true}">
          <SaveIcon title=""/>Save changes
        </button>
      </div>

      <div class="wide-table-wrapper" v-show="!isChangingPassword">
        <table id="myRegistrationTable" class="scrolling-table">
          <tr>
            <td><p>Username</p></td>
            <td>
              <p :class="{'non-editable-cell': isEditingProfile}">
                {{userData.username}}
              </p>
            </td>
          </tr>

          <tr>
            <td><p>Email</p></td>
            <td>
              <p :class="{'non-editable-cell': isEditingProfile}">
                {{userData.email}}
              </p>
            </td>
          </tr>

          <tr>
            <td><p>Telegram username</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.telegramUsername}}</p>
              <input v-else type="text" v-model="editedUser.telegramUsername"/>
            </td>
          </tr>

          <tr>
            <td><p>First name</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.firstName}}</p>
              <input v-else type="text" v-model="editedUser.firstName"/>
            </td>
          </tr>

          <tr>
            <td><p>Last name</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.lastName}}</p>
              <input v-else type="text" v-model="editedUser.lastName"/>
            </td>
          </tr>

          <tr>
            <td><p>Date of birth</p></td>
            <td>
              <p v-if="!isEditingProfile">{{formatBirthday(userData.dateOfBirth)}}</p>
              <input v-else type="date" v-model="editedUser.dateOfBirth"/>
            </td>
          </tr>

          <tr>
            <td><p>Phone number</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.phone}}</p>
              <input v-else type="text" v-model="editedUser.phone"/>
            </td>
          </tr>

          <tr>
            <td><p>Phone country code</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.phoneCountryCode}}</p>
              <input v-else type="number" v-model="editedUser.phoneCountryCode" style="width: 70px;"/>
            </td>
          </tr>

          <tr>
            <td><p>Address line 1</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.addressLine1}}</p>
              <input v-else type="text" v-model="editedUser.addressLine1"/>
            </td>
          </tr>

          <tr>
            <td><p>Address line 2</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.addressLine2}}</p>
              <input v-else type="text" v-model="editedUser.addressLine2"/>
            </td>
          </tr>

          <tr>
            <td><p>Zip code and area</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.addressCity}}</p>
              <input v-else type="text" v-model="editedUser.addressCity"/>
            </td>
          </tr>

          <tr>
            <td><p>State/Province</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.addressStateProvince}}</p>
              <input v-else type="text" v-model="editedUser.addressStateProvince"/>
            </td>
          </tr>

          <tr>
            <td><p>Country</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.addressCountry}}</p>
              <input v-else type="text" v-model="editedUser.addressCountry"/>
            </td>
          </tr>

          <tr>
            <td><p>Fursuiter</p></td>
            <td>
              <p v-if="!isEditingProfile">
                <YesIcon v-if="userData.isFursuiter" title="Yes"/>
                <NoIcon v-else-if="userData.isFursuiter === false" title="No"/>
              </p>
              <p v-else>
                <input type="radio" v-model="editedUser.isFursuiter" :value="true" id="fursuiterYes"/>
                <label for="fursuiterYes">Yes</label>
                <input type="radio" v-model="editedUser.isFursuiter" :value="false" id="fursuiterNo" class="margin-left-10"/>
                <label for="fursuiterNo">No</label>
              </p>
            </td>
          </tr>

          <tr>
            <td><p>Vegan/vegetarian</p></td>
            <td>
              <p v-if="!isEditingProfile">
                <YesIcon v-if="userData.isVegan" title="Yes"/>
                <NoIcon v-else-if="userData.isVegan === false" title="No"/>
              </p>
              <p v-else>
                <input type="radio" v-model="editedUser.isVegan" :value="true" id="veganYes"/>
                <label for="veganYes">Yes</label>
                <input type="radio" v-model="editedUser.isVegan" :value="false" id="veganNo" class="margin-left-10"/>
                <label for="veganNo">No</label>
              </p>
            </td>
          </tr>

          <tr>
            <td><p>Allergies</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.allergiesText}}</p>
              <input v-else type="text" v-model="editedUser.allergiesText"/>
            </td>
          </tr>

          <tr>
            <td><p>Need pickup?</p></td>
            <td>
              <p v-if="!isEditingProfile">
                {{pickupTypeToString(userData.pickupType)}}
              </p>
              <div v-else class="flex-col left-aligned-content">
                <div>
                  <input type="radio" v-model="editedUser.pickupType" :value="'bus'" id="pickupTypeBus"/>
                  <label for="pickupTypeBus">From the bus station</label>
                </div>
                <div>
                  <input type="radio" v-model="editedUser.pickupType" :value="'train'" id="pickupTypeTrain"/>
                  <label for="pickupTypeTrain">From the train station</label>
                </div>
                <div>
                  <input type="radio" v-model="editedUser.pickupType" :value="null" id="pickupTypeNo"/>
                  <label for="pickupTypeNo">No</label>
                </div>
              </div>
            </td>
          </tr>

          <tr v-if="(userData.pickupType !== null && !isEditingProfile) || (editedUser.pickupType !== null && isEditingProfile)">
            <td><p>Pickup time</p></td>
            <td>
              <p v-if="!isEditingProfile">{{formatDateTime(userData.pickupTime)}}</p>
              <input v-else type="datetime-local" v-model="editedUser.pickupTime">
            </td>
          </tr>
          
          <tr>
            <td><p>Additional info</p></td>
            <td>
              <p v-if="!isEditingProfile">{{userData.additionalInfo}}</p>
              <textarea v-else type="text" v-model="editedUser.additionalInfo" rows="2"/>
            </td>
          </tr>

          <tr>
            <td><p>Volunteer</p></td>
            <td>
              <p :class="{'non-editable-cell': isEditingProfile}">
                <YesIcon v-if="userData.isVolunteer" title="Yes"/>
                <NoIcon v-else-if="userData.isVolunteer === false" title="No"/>
                <span v-if="isEditingProfile" style="text-style: italic;"><br/>(only changed by admins)</span>
              </p>
            </td>
          </tr>
        </table>
      </div>

      <form v-show="isChangingPassword">
        <div id="changePasswordGrid">
          <label>Old password:</label>
          <input type="password" v-model="oldPassword"/>
          <label>New password:</label>
          <input type="password" v-model="newPassword1"/>
          <label>Repeat new password:</label>
          <input type="password" v-model="newPassword2"/>
        </div>

        <div class="margin-top-10">
          <button type="button" @click="cancelChangingPassword" @click.prevent v-show="isChangingPassword" class="big-button neutral-button double-button">
            <CancelIcon title=""/>Cancel
          </button>
          <button @click.prevent="confirmChangingPassword" v-show="isChangingPassword" class="big-button theme-button margin-left-10 double-button" type="submit">
            <SaveIcon title/>Change password
          </button>
        </div>
      </form>
    </span>
  </div>
</template>

<script>
import userApi from '../api/user-api'
import ResponseMessage from '../components/ResponseMessage.vue'
import LoadingMessage from '../components/LoadingMessage.vue'

import { mapGetters } from 'vuex'

import YesIcon from 'vue-material-design-icons/CheckCircle.vue'
import NoIcon from 'vue-material-design-icons/Close.vue'
import EditIcon from 'vue-material-design-icons/Pencil.vue'
import SaveIcon from 'vue-material-design-icons/ContentSave.vue'
import CancelIcon from 'vue-material-design-icons/Close.vue'
import LogoutIcon from 'vue-material-design-icons/Logout.vue'

export default {
  name: 'myProfile',

  components: {
    ResponseMessage, LoadingMessage,
    YesIcon, NoIcon, EditIcon, SaveIcon, CancelIcon, LogoutIcon,
  },

  computed: {
    ...mapGetters(['userData']),

    canSave () {
      return Object.keys(this.editedUser).some(key => {
        return key !== 'dateOfBirth' &&
        this.userData[key] !== this.editedUser[key]
      }) || this.editedUser.dateOfBirth != this.userData.dateOfBirth.toISOString().substr(0,10)
    },
  },

  data: function () {
    return {
      isEditingProfile: false,
      isChangingPassword: false,
      editedUser: {},
      responseMessage: '',
      messageType: 'info',
      isUpdatingData: false,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
    }
  },

  methods: {
    startEditing () {
      this.editedUser = {...this.userData}
      if (this.editedUser.dateOfBirth !== null) {
        this.editedUser.dateOfBirth = this.userData.dateOfBirth.toLocalISOString().substring(0,10)
      }
      if (this.editedUser.pickupTime !== null) {
        this.editedUser.pickupTime = this.userData.pickupTime.toLocalISOString()
      }
      this.isEditingProfile = true
    },

    cancelEditing () {
      this.isEditingProfile = false
      this.editedUser = {}
    },

    async confirmEditing () {
      if (this.isUpdatingData) { return }
      this.isUpdatingData = true

      let result = await userApi.saveEditedUser(this.userData['id'], this.editedUser)

      this.isUpdatingData = false

      if ('error' in result) {
        this.messageType = 'error'
        this.responseMessage = result.error
      }
      else {
        this.messageType = 'success'
        this.responseMessage = 'Successfully updated your profile'
        this.$store.dispatch('setUserData', this.editedUser)
        this.cancelEditing()
        this.$store.dispatch('refreshUserData')
      }
    },

    startChangingPassword () {
      this.isChangingPassword = true
      this.oldPassword = ''
      this.newPassword1 = ''
      this.newPassword2 = ''
    },

    cancelChangingPassword () {
      this.isChangingPassword = false
    },

    async confirmChangingPassword () {
      if (this.isUpdatingData) { return }
      this.isUpdatingData = true

      let result = await userApi.changePassword(this.$store.state.userData.email, this.oldPassword, this.newPassword1, this.newPassword2)

      this.isUpdatingData = false

      if ('error' in result) {
        this.responseMessage = result.error
        this.messageType = 'error'
      }
      else {
        this.responseMessage = 'Password changed successfully!'
        this.messageType = 'success'
        this.cancelChangingPassword()
      }
    },

    logout () {
      this.$router.push('/')
      this.$store.dispatch('logout')
      userApi.logout()
    },

    formatDateTime (dateTime) {
      return dateTime===null ? '' : dateTime.toDateString() + ', ' + dateTime.toTimeString().substring(0,5)
    },

    formatBirthday (date) {
      return date.toDateString().substr(4)
    },

    pickupTypeToString (pickupType) {
      if (pickupType === 'bus') { return 'From bus station' }
      else if (pickupType === 'train') { return 'From train station' }
      else { return 'No' }
    },

    closeResponseMessage () {
      this.responseMessage = ''
    }
  }
}
</script>

<style lang="scss">
#myRegistrationTable {
  td {
    text-align: center;
    padding: 4px 8px;
    &:first-child {
      p {
        font-weight: 600;
        text-align: left;
      }
    }
  }
}

#changePasswordGrid {
  display: grid;
  grid-template-rows: auto auto auto;
  grid-template-columns: auto auto;
  grid-row-gap: 4px;
  width: fit-content;
  margin: auto;
  
  input {
    width: 160px;
  }
  label {
    text-align: right;
    margin-right: 4px;
  }
}
</style>
