<template>
  <div>
    <span v-if="!$store.state.isLoggedIn">
      Not logged in. Won't be accessible in final version in this case.
    </span>

    <span v-else>
      <h1>User page: {{$store.state.userData.username}}</h1>

      <button @click="logout" class="big-button neutral-button" style="margin-top: 6px;">
        <LogoutIcon/> Log out
      </button>

      <div style="margin-top: 20px; margin-bottom: 10px;">
        <button @click="startEditing" v-show="!isEditingProfile" class="big-button neutral-button">
          <EditIcon/> Edit profile
        </button>
        <button @click="cancelEditing" v-show="isEditingProfile" class="big-button neutral-button">
          <CancelIcon/> Cancel editing
        </button>
        <button @click="confirmEditing" v-show="isEditingProfile" style="margin-left: 10px;" class="big-button theme-button">
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
              <p v-if="!isEditingProfile">{{userData.dateOfBirth.toDateString().substr(4)}}</p>
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
              <p v-if="!isEditingProfile">{{userData.addressStateprovince}}</p>
              <input v-else type="text" v-model="editedUser.addressStateprovince"/>
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
    YesIcon, NoIcon, EditIcon, SaveIcon, CancelIcon, LogoutIcon,
  },

  computed: {
    ...mapGetters(['userData']),
  },

  data: function () {
    return {
      isEditingProfile: false,
      editedUser: {},
    }
  },

  methods: {
    startEditing () {
      this.editedUser = {...this.userData}
      this.editedUser.dateOfBirth = this.userData.dateOfBirth.toISOString().substr(0,10)
      this.isEditingProfile = true
    },

    cancelEditing () {
      this.isEditingProfile = false
      this.editedUser = {}
    },

    confirmEditing () {
      alert('ok sure')
    },

    logout () {
      this.$router.push('/')
      this.$store.dispatch('logout')
      userApi.logout()
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
  td, p {
  }
}
</style>
