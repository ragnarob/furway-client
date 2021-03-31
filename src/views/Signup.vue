<template>
  <div class="flex-col">
    <h1>Sign up</h1>

    <p style="margin-top: 2rem;">Signing up will be available later.</p>

    <!-- <p>Fields with a thick left border are mandatory.</p>
    <ResponseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"/>

    <div class="signup-row">
      <label>Username</label>
      <input type="text" v-model="username" @focus="onFocusUsername(true)" @blur="onFocusUsername(false)" :class="{'required-input': true, 'error-input': showUsernameError}"/>
      <p v-show="showUsernameError" class="incorrect-field-error">{{usernameErrorMessage}}</p>
    </div>

    <div class="signup-row">
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
    </div>

    <div class="signup-row">
      <label>Email</label>
      <input type="email" v-model="email" class="required-input"/>
    </div>

    <div class="signup-row">
      <label>Telegram username</label>
      <input type="telegramUsername" v-model="telegramUsername"/>
    </div>

    <div class="signup-row">
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
    </div>

    <div class="signup-row">
      <label>Date of birth</label>
      <input type="date" v-model="dateOfBirth" class="required-input"/>
    </div>

    <div class="flex-col signup-row">
      <div>
        <label>Country code, phone number</label>
      </div>
      <div class="two-column-field">
          <input type="number" v-model="phoneCountryCode" class="required-input" style="width: 70px !important;"/>
          <input type="text" v-model="phone" class="required-input" style="margin-left: 6px;"/>
      </div>
    </div>

    <div class="signup-row" style="margin-bottom: 0px;">
      <div class="two-column-field">
        <div class="flex-col">
          <label>Address line 1</label>
          <input type="text" v-model="addressLine1" class="required-input">
        </div>
        <div class="flex-col">
          <label>Address line 2</label>
          <input type="text" v-model="addressLine2">
        </div>
      </div>
    </div>

    <div class="signup-row" style="margin-bottom: 0px; margin-top: 6px;">
      <div class="two-column-field">
        <div class="flex-col">
          <label>Zip code and area</label>
          <input type="text" v-model="addressCity" class="required-input">
        </div>
        <div class="flex-col">
          <label>State/Province</label>
          <input type="text" v-model="addressStateProvince">
        </div>
      </div>
    </div>

    <div class="signup-row" style="margin-top: 6px;">
      <label>Country</label>
      <input type="text" v-model="addressCountry" class="required-input">
    </div>

    <div class="signup-row">
      <label>Will you bring a fursuit?</label>
      <span>
        <input type="radio" v-model="isFursuiter" :value="true" id="isFursuitertrue"/>
        <label for="isFursuitertrue">Yes</label>
        <input type="radio" v-model="isFursuiter" :value="false" id="isFursuiterfalse" style="margin-left: 16px;"/>
        <label for="isFursuiterfalse">No</label>
      </span>
    </div>

    <div class="signup-row">
      <label>Are you vegan/vegetarian?</label>
      <span>
        <input type="radio" v-model="isVegan" :value="true" id="isVegantrue"/>
        <label for="isVegantrue">Yes</label>
        <input type="radio" v-model="isVegan" :value="false" id="isVeganfalse" style="margin-left: 16px;"/>
        <label for="isVeganfalse">No</label>
      </span>
    </div>

    <div class="signup-row">
      <label>Do you have any allergies?</label>
      <input type="text" v-model="allergiesText" style="width: 200px;"/>
    </div>

    <div class="signup-row">
      <label>Do you need transport to the con?</label>
      <p class="tiny-info">If yes, it is highly recommended to supply your Telegram username (above) for the drivers' convenience.</p>
      <p class="tiny-info">If you're uncertain now, you can change this information later.</p>
      <div style="text-align: left; margin-top: 2px;">
        <div>
          <input type="radio" v-model="pickupType" :value="'bus'" id="pickupBusRadio"/>
          <label for="pickupBusRadio">Yes, from the <u>bus</u> station</label>
        </div>
        <div>
          <input type="radio" v-model="pickupType" :value="'train'" id="pickupTrainRadio"/>
          <label for="pickupTrainRadio">Yes, from the <u>train</u> station</label>
        </div>
        <div>
          <input type="radio" v-model="pickupType" :value="null" id="pickupNoRadio"/>
          <label for="pickupNoRadio">No / I don't know yet</label>
        </div>
      </div>
    </div>

    <div class="signup-row" v-show="pickupType !== null && pickupType !== undefined">
      <label>When will you arrive at the {{selectedStation}} station?</label>
      <p class="tiny-info">If you're not sure, you can leave this field blank and fill it in at a later time.</p>
      <input type="datetime-local" v-model="pickupTime"/>
    </div>

    <div class="signup-row">
      <label>Additional info for con staff</label>
      <textarea v-model="additionalInfo" rows="3" style="width: 200px;"/>
    </div>

    <div class="signup-row">
      <p style="max-width: 500px;">
        <input type="checkbox" v-model="hasConsentedToTerms"/>
        I hereby confirm that by creating a user, I accept Furway's terms and conditions, which can be viewed below by
        <span class="link-text" @click="termsAndConditionsIsExpanded = true">clicking here</span>
      </p>
    </div>
    <div v-show="termsAndConditionsIsExpanded" id="termsAndConditions">
      <h3>Furway Terms and conditions 2020</h3>
      <ol>
        <li>
          Participants are required to act in a manner befitting of respect and politeness, as well as avoid offense. Furway is a place with many different people and opinions, and a mutual respect for this fact and this variety is expected from all attendees. Serious transgressions in this regard will result in expulsion from the arrangement.
        </li>
        <li>
          On buying a ticket to FW you concede to joining the organization as a member for one year. Upon buying the ticket, you consent to FW storing the personalia given in the registration form for one year. This information is securely stored in Google Drive, and kept confidential. FW may at all times deny entrance to, or expel from the venue, those without a valid and confirmable ticket.
        </li>
        <li>
          Photography and filming will happen at Furway, both by Furway crew and other participants. By coming to Furway, you acknowledge that this will happen, and acknowledge that you yourself is explicitly responsible for verbally declining being photographed. <u>All attendees that themselves photograph or film others must ask for explicit permission from the one being depicted beforehand</u>.
        </li>
        <li>
          All attendees at the arrangement agree to ensure the facilities and venue remain clean and orderly at all times. Smoking is not permitted inside the venue buildings, and must be done in designated areas outside. Cigarette butts must be collected and safely stored in either ashtrays or appropriate containers.
        </li>
        <li>
          All allergies, intolerances and health issues must be reported to FW beforehand so as to ensure successful and adequate pre-emptive precautions by the FW staff.
        </li>
        <li>
          Participants are themselves responsible for their own health and well-being. FW can not be held responsible for any personal injury that might occur during the arrangement. (Though we’ll certainly do our best to help!)
        </li>
        <li>
          Items and substances prohibited by Norwegian law are in any and all cases forbidden. Transgressions will result in expulsion and possibly legal action.
        </li>
        <li>
          FW has the right to expel anyone excessively intoxicated, or anyone refusing to comply with requests from FW staff about change in behaviour or mannerisms.
        </li>
        <li>
          Animals are allowed on the venue, but not inside the buildings themselves due to hygiene and allergy concerns. Norwegian legislation on leashes apply normally.
        </li>
        <li>
          The organization Furway is both proprietor and in rent of costly equipment and facilities. Attendees must use equipment and facilities only according to premeditated plans and activities, and must treat this fairly. Damage/destruction of equipment, facilities or property will necessitate financial recompense by the parties involved.
        </li>
        <li>
          These terms apply to all meetings and arrangements organized by FW unless otherwise specified. These terms apply to everyone attending the arrangements. By attending a FW arrangement, the attendee agrees to complying with these terms.
        </li>
      </ol>
    </div>
    <br/>

    <button @click="signup" :class="{'big-button': true, 'theme-button': isValidInput, 'disabled-button': !isValidInput, 'double-button': true}">
      <ConfirmIcon/>Sign up
    </button> -->
  </div>
</template>

<script>
import InfoIcon from 'vue-material-design-icons/InformationOutline.vue'
import ConfirmIcon from 'vue-material-design-icons/Check.vue'

import ResponseMessage from '../components/ResponseMessage.vue'
import userApi from '@/api/user-api'

export default {
  name: 'signup',

  components: {
    ResponseMessage,
    InfoIcon, ConfirmIcon,
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
      phoneCountryCode: '',
      isFursuiter: undefined,
      isVegan: undefined,
      allergiesText: '',
      additionalInfo: '',
      
      addressLine1: '',
      addressLine2: '',
      addressCity: '',
      addressStateProvince: '',
      addressCountry: '',

      pickupType: undefined,
      pickupTime: undefined,

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
      return ![this.firstName, this.lastName, this.phone, this.phoneCountryCode, this.addressLine1, this.addressCity, this.addressCountry].some(s => s==='undefined' || s.length === 0)
        && /^[a-zA-ZÆØÅæøå][\w\d_-ÆØÅæøå]{1,19}$/.test(this.username)
        && this.password1.length >= 6 && this.password2.length >= 6
        && this.isFursuiter !== undefined && this.isVegan !== undefined
        && this.pickupType !== undefined
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

    selectedStation () {
      return this.pickupType === 'bus' ? 'bus' : 'train'
    }
  },

  methods: {
    // fillFieldsWithStuff () {
    //   this.password1 = 'asdasd'
    //   this.password2 = 'asdasd'
    //   this.telegramUsername = 'TeleUserXxX'
    //   this.firstName = 'Nord'
    //   this.lastName = 'Olamann'
    //   this.dateOfBirth = '1995-08-22'
    //   this.phone = '420420420'
    //   this.phoneCountryCode = '+47'
    //   this.isFursuiter = true
    //   this.isVegan = false
    //   this.allergiesText = 'Tåler ikke gluteeeen'
    //   this.additionalInfo = 'Gleder meg til con uwu'
    //   this.addressLine1 = 'Trondheimsveien 01'
    //   this.addressCity = '7070 Trondheim'
    //   this.addressCountry = 'Norway'
    //   this.pickupType = 'train'
    //   this.pickupTime = '2019-06-10T13:00:00'
    //   this.hasConsentedToTerms = true
    //   this.email = this.generateRandomString(10)
    // },

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
        phoneCountryCode: this.phoneCountryCode,
        isFursuiter: this.isFursuiter,
        isVegan: this.isVegan,
        allergiesText: this.allergiesText || null,
        additionalInfo: this.additionalInfo || null,
        addressLine1: this.addressLine1,
        addressLine2: this.addressLine2 || null,
        addressCity: this.addressCity,
        addressStateProvince: this.addressStateProvince || null,
        addressCountry: this.addressCountry,
        pickupType: this.pickupType,
        pickupTime: this.pickupTime,
      }

      let response = await userApi.signup(userInfoObject)
      this.handleSignupResponse(response)
    },

    async handleSignupResponse (response) {
      if ('error' in response) {
        this.responseMessage = response.error
        this.responseMessageType = 'error'
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
      else {
        this.responseMessage = 'Success!'
        this.responseMessageType = 'success'
        this.$store.dispatch('setUserData', response)
        this.$router.push('my-profile')
      }
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

.signup-row {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  box-sizing: border-box;
  padding: 0px 16px;
  margin-top: 10px;
  max-width: 800px;
  @media screen and (max-width: 849px) {
    max-width: 90%;
    padding: 10px;
  }
  ol {
    text-align: left;
    padding-left: 20px;
    li {
      margin-top: 10px;
    }
  }
}
</style>