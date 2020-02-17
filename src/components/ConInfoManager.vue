<template>
  <div v-if="isOpen">
    <p style="margin-bottom: 8px;">Most of the information in this table should be set before registration opens, and not touched afterwards.</p>

    <RepsonseMessage :message="responseMessage" :messageType="responseMessageType" @closeMessage="closeResponseMessage"/>

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
        <td>Inside spots</td>
        <td>
          <span v-if="!isEditing.numberOfInsideSpots">
            {{conInfo.numberOfInsideSpots}}
            <button @click="editField('numberOfInsideSpots')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <input type="number" v-model="editedConInfo.numberOfInsideSpots">
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
        <td>Outside spots</td>
        <td>
          <span v-if="!isEditing.numberOfOutsideSpots">
            {{conInfo.numberOfOutsideSpots}}
            <button @click="editField('numberOfOutsideSpots')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <div class="flex-col">
              <input type="number" v-model="editedConInfo.numberOfOutsideSpots">
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
        <td>Registration opening date</td>
        <td>
          <span v-if="!isEditing.registrationOpenDate">
            {{formatLongTimestamp(conInfo.registrationOpenDate)}}
            <button @click="editField('registrationOpenDate')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="datetime-local" v-model="editedConInfo.registrationOpenDate"/>
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
            {{formatLongTimestamp(conInfo.volunteerRegistrationOpenDate)}}
            <button @click="editField('volunteerRegistrationOpenDate')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="datetime-local" v-model="editedConInfo.volunteerRegistrationOpenDate"/>
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
            {{formatLongTimestamp(conInfo.registrationCloseDate)}}
            <button @click="editField('registrationCloseDate')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="datetime-local" v-model="editedConInfo.registrationCloseDate"/>
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
            {{formatLongTimestamp(conInfo.originalPaymentDeadline)}}
            <button @click="editField('originalPaymentDeadline')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="datetime-local" v-model="editedConInfo.originalPaymentDeadline"/>
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
            The last possible date for payments - used if someone receives their spot <br/>just after the payment deadline because someone else lost their spot
          </p>
        </td>
        <td>
          <span v-if="!isEditing.finalPaymentDeadline">
            {{formatLongTimestamp(conInfo.finalPaymentDeadline)}}
            <button @click="editField('finalPaymentDeadline')" class="icon-button icon-button-small">
              <EditIcon title="Edit"/>
            </button>
          </span>
          <span v-else>
            <input type="datetime-local" v-model="editedConInfo.finalPaymentDeadline"/>
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
import { formatShortTimestamp, formatBoolean, formatLongTimestamp } from '../utils'
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
      responseMessageType: 'info',
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
        this.responseMessageType = 'error'
      }
      else {
        this.responseMessage = 'Success!'
        this.responseMessageType = 'success'
        this.cancelEditing()
        this.$store.dispatch('loadAllAdminData')
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

    formatShortTimestamp, formatBoolean, formatLongTimestamp,
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