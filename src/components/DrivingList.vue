<template>
  <div v-if="isOpen">
    <p>Only users with received spots are shown.</p>

    <div class="wide-table-wrapper">
      <table class="margin-top-10 very-wide-table">
        <thead>
          <tr>
            <th>From</th>
            <th>Time</th>
            <th>Username</th>
            <th>Telegram</th>
            <th>Full name</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in drivingList" :key="user.id" :class="{'bus-row': user.pickupType==='Bus', 'train-row': user.pickupType==='Train'}">
            <td>
              {{user.pickupType}}
            </td>

            <td>
              {{formatTimestamp(user.pickupTime)}}
            </td>

            <td>
              {{user.username}}
            </td>

            <td>
              {{user.telegramUsername}}
            </td>

            <td>
              {{user.firstName}} {{user.lastName}}
            </td>

            <td>
              {{user.phoneCountryCode}}{{user.phone}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import miscApi from '../api/misc-api'

export default {
  name: 'drivingList',

  props: {
    isOpen: Boolean,
  },

  data: function () {
    return {
      drivingList: [],
    }
  },

  async mounted () {
    this.drivingList = await miscApi.getDriverInfo()
  },

  methods: {
    formatTimestamp (timestamp) {
      if (!timestamp) { return '' }
      let tsDate = new Date(timestamp)
      return tsDate.toDateString().substr(4,6) + ', ' + tsDate.toTimeString().substr(0,5)
    },
  }
}
</script>

<style lang="scss">
.bus-row {
  background-color: rgb(255, 232, 251);
}
.train-row {
  background-color: rgb(237, 255, 224);
}
</style>