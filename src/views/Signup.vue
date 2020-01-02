<template>
  <div class="flex-col">
    <h1>Create user</h1>

    <p v-if="errorMessage" class="error-message">Error: {{errorMessage}}</p>

    <label>Username</label>
    <input type="text" v-model="username"/>
    <br/>

    <label>Password</label>
    <input type="password" v-model="password"/>
    <br/>

    <label>Email</label>
    <input type="email" v-model="email"/>
    <br/>

    <label>First name</label>
    <input type="text" v-model="firstName"/>
    <br/>

    <label>Last name</label>
    <input type="text" v-model="lastName"/>
    <br/>

    <label>Date of birth</label>
    <input type="date" v-model="dateOfBirth"/>
    <br/>

    <label>Phone number</label>
    <input type="text" v-model="phone"/>
    <br/>

    <label>Will you bring a fursuit?</label>
    <span>
      <input type="radio" v-model="isFursuiter" value="0"/> No
      <input type="radio" v-model="isFursuiter" value="1"/> Yes
    </span>
    <br/>

    <label>Are you vegan?</label>
    <span>
      <input type="radio" v-model="isVegan" value="0"/> No
      <input type="radio" v-model="isVegan" value="1"/> Yes
    </span>
    <br/>

    <label>Do you have any allergies?</label>
    <input type="text" v-model="allergiesText"/>
    <br/>

    <label>Additional info for con staff</label>
    <input type="textarea" v-model="additionalInfo"/>
    <br/>

    <label>Bla bla adresse, osv. Kommer i final version</label>
    <br/>

    <button @click="signup">Create user</button>
  </div>
</template>

<script>
import userApi from '@/api/user-api'

export default {
  name: 'signup',

  data: function () {
    return {
      errorMessage: '',

      username: '',
      password: '',
      email: this.generateRandomString() + '@mail.com',
      firstName: 'Fornavn',
      lastName: 'Etternavnsen',
      dateOfBirth: '1995-12-01',
      phone: '+4701010101',
      isFursuiter: '0',
      isVegan: '0',
      allergiesText: 'Jeg har allergier',
      additionalInfo: 'Litt info her lalala.',
      addressLine1: 'Gatenavn tall',
      addressLine2: '69 C',
      addressCity: 'Trondheim',
      addressStateprovince: '',
      addressCountry: 'Norway',
    }
  },

  methods: {
    async signup () {
      let userInfoObject = {
        username: this.username,
        password1: this.password,
        password2: this.password,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        dateOfBirth: this.dateOfBirth,
        phone: this.phone,
        isFursuiter: this.isFursuiter,
        isVegan: this.isVegan,
        allergiesText: this.allergiesText || null,
        additionalInfo: this.additionalInfo || null,
        addressLine1: this.addressLine1,
        addressLine2: this.addressLine2 || null,
        addressCity: this.addressCity,
        addressStateprovince: this.addressStateprovince || null,
        addressCountry: this.addressCountry,
      }

      let response = await userApi.signup(userInfoObject)
      this.handleSignupResponse(response)
    },

    handleSignupResponse (response) {
      if ('error' in response) {
        this.errorMessage = response.error
      }
      else {
        this.$store.commit('setUserData', response)
        this.$router.push('user')
      }
    },

    generateRandomString (length=8) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
  }
}
</script>
