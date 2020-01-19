<template>
  <div v-if="isOpen">
    <p style="margin-bottom: 8px;">Most of the information in this table should be set before registration opens, and not touched afterwards.</p>

    <RepsonseMessage :message="responseMessage" :isError="isErrorMessage" @closeMessage="closeResponseMessage" v-if="responseMessage"/>

    <table>
      <tr>
        <td>
          Con start date
          <p v-show="showExplanations" class="explanation">
            First <i>main</i> day, not early arrival
          </p>
        </td>
        <td>
          <span v-if="!isEditing.conStartDate">
            {{formatShortTimestamp(conInfo.conStartDate)}}
            <button @click="editField('conStartDate')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="date" v-model="editedConInfo.conStartDate"/>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small theme-button">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Registration opening date</td>
        <td>
          <span v-if="!isEditing.registrationOpenDate">
            {{formatShortTimestamp(conInfo.registrationOpenDate)}}
            <button @click="editField('registrationOpenDate')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="date" v-model="editedConInfo.registrationOpenDate"/>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small theme-button">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Registration opening date, volunteers</td>
        <td>
          <span v-if="!isEditing.volunteerRegistrationOpenDate">
            {{formatShortTimestamp(conInfo.volunteerRegistrationOpenDate)}}
            <button @click="editField('volunteerRegistrationOpenDate')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="date" v-model="editedConInfo.volunteerRegistrationOpenDate"/>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small theme-button">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Registration closing date</td>
        <td>
          <span v-if="!isEditing.registrationCloseDate">
            {{formatShortTimestamp(conInfo.registrationCloseDate)}}
            <button @click="editField('registrationCloseDate')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="date" v-model="editedConInfo.registrationCloseDate"/>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small theme-button">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>
          Default main payment deadline
          <p v-show="showExplanations" class="explanation">
            Default deadline, can be overridden by admins
          </p>
        </td>
        <td>
          <span v-if="!isEditing.originalPaymentDeadline">
            {{formatShortTimestamp(conInfo.originalPaymentDeadline)}}
            <button @click="editField('originalPaymentDeadline')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="date" v-model="editedConInfo.originalPaymentDeadline"/>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small theme-button">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Addon payment deadline</td>
        <td>
          <span v-if="!isEditing.addonPaymentDeadline">
            {{formatShortTimestamp(conInfo.addonPaymentDeadline)}}
            <button @click="editField('addonPaymentDeadline')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="date" v-model="editedConInfo.addonPaymentDeadline"/>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small theme-button">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>
          Final payment deadline
          <p v-show="showExplanations" class="explanation">
            The last possible date for an admin to manually set payment deadlines
          </p>
        </td>
        <td>
          <span v-if="!isEditing.finalRegPaymentDeadline">
            {{formatShortTimestamp(conInfo.finalRegPaymentDeadline)}}
            <button @click="editField('finalRegPaymentDeadline')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="date" v-model="editedConInfo.finalRegPaymentDeadline"/>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small theme-button">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Selling t-shirts?</td>
        <td>
          <span v-if="!isEditing.isSellingTshirts">
            {{formatBoolean(conInfo.isSellingTshirts)}}
            <button @click="editField('isSellingTshirts')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <span><input type="radio" v-model="editedConInfo.isSellingTshirts" :value="true"/> Yes</span>
              <span><input type="radio" v-model="editedConInfo.isSellingTshirts" :value="false"/> No</span>
            </div>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small" style="margin-left: 10px;">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Selling hoodies?</td>
        <td>
          <span v-if="!isEditing.isSellingHoodies">
            {{formatBoolean(conInfo.isSellingHoodies)}}
            <button @click="editField('isSellingHoodies')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <span><input type="radio" v-model="editedConInfo.isSellingHoodies" :value="true"/> Yes</span>
              <span><input type="radio" v-model="editedConInfo.isSellingHoodies" :value="false"/> No</span>
            </div>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small" style="margin-left: 10px;">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Main days inside price, NOK</td>
        <td>
          <span v-if="!isEditing.mainDaysInsidePriceNok">
            {{conInfo.mainDaysInsidePriceNok}}
            <button @click="editField('mainDaysInsidePriceNok')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <input type="number" v-model="editedConInfo.mainDaysInsidePriceNok">
            </div>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small" style="margin-left: 10px;">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Main days outside price, NOK</td>
        <td>
          <span v-if="!isEditing.mainDaysOutsidePriceNok">
            {{conInfo.mainDaysOutsidePriceNok}}
            <button @click="editField('mainDaysOutsidePriceNok')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <input type="number" v-model="editedConInfo.mainDaysOutsidePriceNok">
            </div>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small" style="margin-left: 10px;">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Early arrival price, NOK</td>
        <td>
          <span v-if="!isEditing.earlyArrivalPriceNok">
            {{conInfo.earlyArrivalPriceNok}}
            <button @click="editField('earlyArrivalPriceNok')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <input type="number" v-model="editedConInfo.earlyArrivalPriceNok">
            </div>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small" style="margin-left: 10px;">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>Late departure price, NOK</td>
        <td>
          <span v-if="!isEditing.lateDeparturePriceNok">
            {{conInfo.lateDeparturePriceNok}}
            <button @click="editField('lateDeparturePriceNok')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <input type="number" v-model="editedConInfo.lateDeparturePriceNok">
            </div>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small" style="margin-left: 10px;">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>
          T-shirt price, NOK
          <p v-show="showExplanations" class="explanation">
            Can be ignored if not selling t-shirts
          </p>
        </td>
        <td>
          <span v-if="!isEditing.tshirtPriceNok">
            {{conInfo.tshirtPriceNok}}
            <button @click="editField('tshirtPriceNok')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <input type="number" v-model="editedConInfo.tshirtPriceNok">
            </div>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small" style="margin-left: 10px;">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>

      <tr>
        <td>
          Hoodie price, NOK
          <p v-show="showExplanations" class="explanation">
            Can be ignored if not selling hoodies
          </p>
        </td>
        <td>
          <span v-if="!isEditing.hoodiePriceNok">
            {{conInfo.hoodiePriceNok}}
            <button @click="editField('hoodiePriceNok')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <input type="number" v-model="editedConInfo.hoodiePriceNok">
            </div>
            <button @click="cancelEditing" class="icon-button icon-button-small">
              <CancelIcon title="Cancel"/>
            </button>
            <button @click="saveField" class="icon-button icon-button-small" style="margin-left: 10px;">
              <SaveIcon title="Save"/>
            </button>
          </span>
        </td>
      </tr>
    </table>
    
    <button @click="showExplanations = !showExplanations" style="margin-top: 6px;">
      {{showExplanations ? 'Hide explanations' : 'Show explanations'}}
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatShortTimestamp, formatBoolean } from '../utils'
import miscApi from "../api/misc-api";
import RepsonseMessage from './ResponseMessage.vue'

import EditIcon from 'vue-material-design-icons/Pencil.vue'
import SaveIcon from 'vue-material-design-icons/ContentSave.vue'
import CancelIcon from 'vue-material-design-icons/Close.vue'
import InfoIcon from 'vue-material-design-icons/InformationOutline.vue'

export default {
  name: 'conInfoManager',

  components: {
    RepsonseMessage,
    EditIcon, SaveIcon, CancelIcon, InfoIcon,
  },

  props: {
    isOpen: Boolean,
  },

  computed: {
    ...mapGetters(['conInfo'])
  },

  data: function () {
    return {
      responseMessage: '',
      isErrorMessage: true,
      showExplanations: false,
      editedConInfo: {...this.conInfo},
      isEditing: this.getNoneEditingObject(),
    }
  },

  methods: {
    editField (fieldName) {
      this.cancelEditing()
      this.isEditing[fieldName] = true
    },

    getNoneEditingObject () {
      return {
        'registrationOpenDate': false,
      }
    },

    async saveField () {
      let result = await miscApi.updateConInfo(this.editedConInfo)

      if ('error' in result) {
        this.responseMessage = result.error
        this.isErrorMessage = true
      }
      else {
        this.responseMessage = 'Success!'
        this.isErrorMessage = false
        this.cancelEditing()
        this.$store.dispatch('loadData')
        this.$store.dispatch('loadConInfo')
      }
    },

    cancelEditing () {
      this.editedConInfo = {...this.conInfo}
      this.isEditing = this.getNoneEditingObject()
    },

    closeResponseMessage () {
      this.responseMessage = ''
    },

    formatShortTimestamp, formatBoolean,
  },
}
</script>

<style lang="scss" scoped>
  .icon-button-small {
    margin-left: 8px !important;
  }

  table {
    td {
      text-align: left;
      span {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .explanation {
    font-size: 12px;
    font-style: italic;
    text-align: left;
    &:hover {
      cursor: default;
    }
  }

  input[type="radio"] {
    margin: 0 2px 2px 0;
  }
  input[type="number"] {
    width: 60px;
  }
</style>