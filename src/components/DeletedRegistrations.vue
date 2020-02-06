<template>
  <div class="wide-table-wrapper" v-show="isOpen">
    <table class="very-wide-table">
      <tr>
        <th>Id</th>
        <th>Username</th>
        <th>Ticket</th>
        <th title="Approved">Appr.</th>
        <th>Early</th>
        <th>Late</th>
        <th title="T-shirt">Ts.</th>
        <th title="Hoodie">Hd.</th>
        <th title="T-shirt size">Ts. sz</th>
        <th title="Hoodie size">Hd. sz</th>
        <th title="Submitted time">Subm.</th>
        <th title="Payment deadline">Pay deadl.</th>
        <th title="Received inside spot">Rec. ins.</th>
        <th title="Received outside spot">Rec. outs.</th>
      </tr>
      <tr v-for="reg in registrations" :key="reg.id">
        <td>
          <p class="registration-id-cell">
            {{reg.id}}
          </p>
        </td>

        <td>
          <p>
            {{reg.username}}
          </p>
        </td>

        <td>
          <p>{{formatRoomPreference(reg.roomPreference)}}</p>
        </td>

        <td>
          <p>
            <YesIcon v-if="reg.isAdminApproved" title="Yes"/>
            <NoIcon v-else-if="reg.isAdminApproved === false" title="No"/>
          </p>
        </td>

        <td>
          <p>
            <YesIcon v-if="reg.earlyArrival" title="Yes"/>
            <NoIcon v-else-if="reg.earlyArrival === false" title="No"/>
          </p>
        </td>

        <td>
          <p>
            <YesIcon v-if="reg.lateDeparture" title="Yes"/>
            <NoIcon v-else-if="reg.lateDeparture === false" title="No"/>
          </p>
        </td>

        <td>
          <p>
            <YesIcon v-if="reg.buyTshirt" title="Yes"/>
            <NoIcon v-else-if="reg.buyTshirt === false" title="No"/>
          </p>
        </td>

        <td>
          <p>
            <YesIcon v-if="reg.buyHoodie" title="Yes"/>
            <NoIcon v-else-if="reg.buyHoodie === false" title="No"/>
          </p>
        </td>

        <td>
          <p>{{reg.tshirtSize}}</p>
        </td>

        <td>
          <p>{{reg.hoodieSize}}</p>
        </td>

        <td>
          <p>
            {{formatTimestamp(reg.timestamp, $store.getters.timestampFormat)}}
          </p>
        </td>

        <td>
          <p>
            {{formatTimestamp(reg.paymentDeadline, $store.getters.timestampFormat)}}
          </p>
        </td>

        <td>
          <p>
            <YesIcon v-if="reg.receivedInsideSpot" title="Yes"/>
            <NoIcon v-else-if="reg.receivedInsideSpot === false" title="No"/>
          </p>
        </td>

        <td>
          <p>
            <YesIcon v-if="reg.receivedOutsideSpot" title="Yes"/>
            <NoIcon v-else-if="reg.receivedOutsideSpot === false" title="No"/>
          </p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatTimestamp, formatRoomPreference } from '../utils'
import registrationApi from '../api/registration-api'

import YesIcon from 'vue-material-design-icons/CheckCircle.vue'
import NoIcon from 'vue-material-design-icons/Close.vue'

export default {
  name: 'deletedRegistrations',

  props: {
    isOpen: Boolean,
  },

  components: {
    YesIcon, NoIcon
  },

  data: function () {
    return {
      registrations: [],
    }
  },

  computed: {
    ...mapGetters(['timestampFormat']),
  },

  methods: {
    formatTimestamp,
    formatRoomPreference,
  },

  async mounted () {
    this.registrations = await registrationApi.getDeletedRegistrations()
  }
}
</script>