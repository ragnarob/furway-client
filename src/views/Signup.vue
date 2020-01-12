<template>
  <div class="flex-col">
    <h1>Create user</h1>

    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"/>

    <label>Username</label>
    <input type="text" v-model="username" @focus="onFocusUsername(true)" @blur="onFocusUsername(false)" :class="{'required-input': true, 'error-input': showUsernameError}"/>
    <p v-show="showUsernameError" class="incorrect-field-error">{{usernameErrorMessage}}</p>
    <br/>

    <div class="two-column-field">
      <div class="flex-col">
        <label>Password <span class="tiny-info">(min. length 6)</span></label>
        <input type="password" v-model="password1" @focus="onFocusPassword(true, 1)" @blur="onFocusPassword(false, 1)" :class="{'required-input': true, 'error-input': showPasswordError}"/>
      </div>
      <div class="flex-col">
        <label>Repeat password</label>
        <input type="password" v-model="password2" @focus="onFocusPassword(true, 2)" @blur="onFocusPassword(false, 2)" :class="{'required-input': true, 'error-input': showPasswordError}"/>
      </div>
    </div>
    <p v-show="showPasswordError" class="incorrect-field-error">{{passwordErrorMessage}}</p>
    <br/>

    <label>Email</label>
    <input type="email" v-model="email" class="required-input"/>
    <br/>

    <label>Telegram username</label>
    <input type="telegramUsername" v-model="telegramUsername"/>
    <br/>

    <div class="two-column-field">
      <div class="flex-col">
        <label>First name</label>
        <input type="text" v-model="firstName" class="required-input"/>
      </div>
      <div class="flex-col">
        <label>Last name</label>
        <input type="text" v-model="lastName" class="required-input"/>
      </div>
    </div>
    <br/>

    <label>Date of birth</label>
    <input type="date" v-model="dateOfBirth" class="required-input"/>
    <br/>

    <label>Phone number</label>
    <input type="text" v-model="phone" class="required-input"/>
    <br/>

    <div class="two-column-field" style="margin-bottom: 4px;">
      <div class="flex-col">
        <label>Address line 1</label>
        <input type="text" v-model="addressLine1" class="required-input">
      </div>
      <div class="flex-col">
        <label>Address line 2</label>
        <input type="text" v-model="addressLine2">
      </div>
    </div>

    <div class="two-column-field" style="margin-bottom: 4px;">
      <div class="flex-col">
        <label>City</label>
        <input type="text" v-model="addressCity" class="required-input">
      </div>
      <div class="flex-col">
        <label>Zip code</label>
        <input type="text" v-model="addressZipCode" class="required-input">
      </div>
    </div>

    <div class="two-column-field">
      <div class="flex-col">
        <label>State/Province</label>
        <input type="text" v-model="addressStateprovince">
      </div>
      <div class="flex-col">
        <label>Country</label>
        <input type="text" v-model="addressCountry" class="required-input">
      </div>
    </div>
    <br/>


    <label>Will you bring a fursuit?</label>
    <span>
      <input type="radio" v-model="isFursuiter" :value="true"/> Yes
      <input type="radio" v-model="isFursuiter" :value="false"/> No
    </span>
    <br/>

    <label>Are you vegan?</label>
    <span>
      <input type="radio" v-model="isVegan" :value="true"/> Yes
      <input type="radio" v-model="isVegan" :value="false"/> No
    </span>
    <br/>

    <label>Do you have any allergies?</label>
    <input type="text" v-model="allergiesText" style="width: 200px;"/>
    <br/>

    <label>Additional info for con staff</label>
    <textarea v-model="additionalInfo" rows="3" style="width: 200px;"/>
    <br/>

    <p style="max-width: 500px;">
      <input type="checkbox" v-model="hasConsentedToTerms"/>
      I hereby confirm that by creating a user, I accept Furway's T&C, which can be viewed below by
      <span class="link-text" @click="termsAndConditionsIsExpanded = true">clicking here</span>
    </p>
    <div v-show="termsAndConditionsIsExpanded" id="termsAndConditions">
      <h3>Furway's T's & C's</h3>
      <p>LOREM IPSUM OG SÅNT</p>
    </div>
    <br/>

    <button @click="signup" :class="{'big-button': true, 'theme-button': isValidInput, 'disabled-button': !isValidInput}" >Create user</button>
  </div>
</template>

<script>
import InfoIcon from 'vue-material-design-icons/InformationOutline.vue'
import ResponseMessage from '../components/ResponseMessage.vue'
import userApi from '@/api/user-api'

export default {
  name: 'signup',

  components: {
    ResponseMessage,
    InfoIcon,
  },

  data: function () {
    return {
      responseMessage: '',
      responseMessageType: 'error',

      username: '',
      password1: '',
      password2: '',
      email: '',
      telegramUsername: '',
      firstName: '',
      lastName: '',
      dateOfBirth: undefined,
      phone: '',
      isFursuiter: undefined,
      isVegan: undefined,
      allergiesText: '',
      additionalInfo: '',
      addressLine1: '',
      addressLine2: '',
      addressCity: '',
      addressZipCode: '',
      addressStateprovince: '',
      addressCountry: '',

      hasConsentedToTerms: false,
      termsAndConditionsIsExpanded: false,

      hasShownErrorMessage: {
        username: false,
        password: false,
      },
      passwordFieldsFocused: {
        1: false, 2: false
      }
    }
  },

  computed: {
    isValidInput () {
      return ![this.firstName, this.lastName, this.phone, this.addressLine1, this.addressCity, this.addressCountry, this.addressZipCode].some(s => s==='undefined' || s.length === 0)
        && /^[a-zA-ZÆØÅæøå][\w\d_-ÆØÅæøå]{1,19}$/.test(this.username)
        && this.password1.length >= 6 && this.password2.length >= 6
        && this.isFursuiter !== undefined && this.isVegan !== undefined
        && this.dateOfBirth !== undefined
        && this.hasConsentedToTerms
    },

    usernameErrorMessage () {
      if (this.username.length === 0) {
        return undefined
      }
      if (this.username.length < 3 || this.username.length > 21) {
        return 'Must be 3-20 characters long'
      }
      else if (!(/^[a-zA-ZÆØÅæøå][\w\d_-ÆØÅæøå]{2,20}$/.test(this.username))) {
        return 'Username contains invalid characters'
      }

      return undefined
    },

    showUsernameError ()  {
      return this.usernameErrorMessage !== undefined && this.hasShownErrorMessage['username'] === true
    },

    passwordErrorMessage () {
      if (this.password1.length === 0 || this.password2.length === 0) {
        return undefined
      }
      else if (this.password1 !== this.password2) {
        return 'Passwords do not match'
      }
      else if (this.password1.length < 6) {
        return 'Minimum length 6'
      }

      return undefined
    },

    showPasswordError () {
      return this.passwordErrorMessage !== undefined && this.hasShownErrorMessage['password'] === true
    },
  },

  methods: {
    async signup () {
      if (!this.isValidInput) { return }

      let userInfoObject = {
        username: this.username,
        password1: this.password1,
        password2: this.password2,
        email: this.email,
        telegramUsername: this.telegramUsername,
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

    onFocusUsername (isFocused) {
      if (!isFocused && this.usernameErrorMessage !== undefined) {
        this.hasShownErrorMessage['username'] = true
      }
    },

    onFocusPassword (isFocused, passwordFieldNumber) {
      if (!isFocused) {
        this.passwordFieldsFocused[passwordFieldNumber] = this.passwordFieldsFocused[passwordFieldNumber] || true
      }
      if (this.passwordFieldsFocused[1] && this.passwordFieldsFocused[2] && this.passwordErrorMessage) {
        this.hasShownErrorMessage['password'] = true
      }
    },

    closeResponseMessage () {
      this.responseMessage = ''
    },

    handleSignupResponse (response) {
      if ('error' in response) {
        this.responseMessage = response.error
        this.responseMessageType = 'error'
      }
      else {
        this.responseMessage = 'Success!'
        this.responseMessageType = 'success'
        this.$store.commit('setUserData', response)
        this.$router.push('user')
      }
    },

    generateRandomString (length=8) {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
  }
}
</script>

<style lang="scss" scoped>
input[type="text"], input[type="password"] {
  width: 140px;
}
input[type="email"] {
  width: 200px;
}

.two-column-field {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  input {
    width: 140px !important;
  }

  div {
    margin: auto 4px;
  }
}

#termsAndConditions {
  border: 1px solid #ccc;
  padding: 16px;
  margin-top: 10px;
}
</style>