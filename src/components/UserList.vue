<template>        
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
      <th>City</th>
      <th>State</th>
      <th>Country</th>
      <th>Additional info</th>
      <th>Volunteer</th>
      <th>Admin</th>
    </tr>
    <tr v-for="user in allUsers" :key="user.id">
      <td>
        <button v-if="userBeingEdited === null" @click="editUser(user.id)">Edit</button>
        <button v-if="userBeingEdited === null" @click="deleteUser(user.id)">Del</button>

        <button v-if="isThisUserBeingEdited(user.id)" @click="cancelEditing()">Cancel</button>
        <br v-if="isThisUserBeingEdited(user.id)">
        <button v-if="isThisUserBeingEdited(user.id)" @click="saveUser()">Save</button>
      </td>
      <td>
        <p :class="{'non-editable-cell': isThisUserBeingEdited(user.id)}">
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
          {{user.isVegan}}
        </p>
      </td>
      <td>
        <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
          <input type="radio" v-model="userBeingEdited.isFursuiter" value="true"/> true
          <input type="radio" v-model="userBeingEdited.isFursuiter" value="false"/> false
        </p>
        <p v-else>
          {{user.isFursuiter}}
        </p>
      </td>
      <td>
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
        <input v-if="isThisUserBeingEdited(user.id)" type="text" v-model="userBeingEdited.additionalInfo" style="width: 200px;"/>
        <p v-else>
          {{user.additionalInfo}}
        </p>
      </td>
      <td>
        <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
          <input type="radio" v-model="userBeingEdited.isVolunteer" value="true"/> true
          <input type="radio" v-model="userBeingEdited.isVolunteer" value="false"/> false
        </p>
        <p v-else>
          {{user.isVolunteer}}
        </p>
      </td>
      <td>
        <p v-if="isThisUserBeingEdited(user.id)" class="cell-with-radio">
          <input type="radio" v-model="userBeingEdited.isAdmin" value="true"/> true
          <input type="radio" v-model="userBeingEdited.isAdmin" value="false"/> false
        </p>
        <p v-else>
          {{user.isAdmin}}
        </p>
      </td>
    </tr>
  </table>
</template>

<script>
import userApi from '../api/user-api'

export default {
  props: {
    allUsers: Array
  },

  data: function () {
    return {
      userBeingEdited: null,
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

    saveUser () {
      
    },

    formatBdayTimestamp (timestamp) {
      return new Date(timestamp).toDateString().substr(4,11)
    },
  }
}
</script>

