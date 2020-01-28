<template>
  <div>
    <span v-if="!$store.state.isLoggedIn">
      Not logged in.
    </span>

    <span v-else>
      <h1>User page: {{$store.state.userData.username}}</h1>

      <p>You can edit your user profile without your registration and waiting list positions being affected.</p>

      <ResponseMessage :message="responseMessage" :messageType="messageType" @closeMessage="closeResponseMessage" v-if="responseMessage"/>
      <LoadingMessage :message="'Updating profile...'" v-if="isUpdatingData"/>

      <div style="margin-top: 10px; margin-bottom: 10px;">
        <button @click="startEditing" v-show="!isEditingProfile" class="big-button neutral-button">
          <EditIcon/> Edit profile
        </button>
        <button @click="cancelEditing" v-show="isEditingProfile" class="big-button neutral-button">
          <CancelIcon/> Cancel editing
        </button>
        <button @click="confirmEditing" v-show="isEditingProfile" style="margin-left: 10px;" :class="{'big-button': true, 'theme-button': canSave, 'disabled-button': !canSave}">
          <SaveIcon/> Save changes
        </button>
      </div>

      <div class="wide-table-wrapper">
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
                <YesIcon v-if="userData.isFursuiter"/>
                <NoIcon v-else-if="userData.isFursuiter === false"/>
              </p>
              <p v-else>
                <input type="radio" v-model="editedUser.isFursuiter" :value="true"/>Yes
                <input type="radio" v-model="editedUser.isFursuiter" :value="false"/>No
              </p>
            </td>
          </tr>

          <tr>
            <td><p>Vegan/vegetarian</p></td>
            <td>
              <p v-if="!isEditingProfile">
                <YesIcon v-if="userData.isVegan"/>
                <NoIcon v-else-if="userData.isVegan === false"/>
              </p>
              <p v-else>
                <input type="radio" v-model="editedUser.isVegan" :value="true"/>Yes
                <input type="radio" v-model="editedUser.isVegan" :value="false"/>No
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
                <YesIcon v-if="userData.isVolunteer"/>
                <NoIcon v-else-if="userData.isVolunteer === false"/>
                <span v-if="isEditingProfile" style="text-style: italic;"><br/>(only changed by admins)</span>
              </p>
            </td>
          </tr>
        </table>
      </div>
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
      editedUser: {},
      responseMessage: '',
      messageType: 'info',
      isUpdatingData: false,
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
</style>
