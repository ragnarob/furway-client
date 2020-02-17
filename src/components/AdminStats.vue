<template>
  <div v-show="isOpen" id="twoColumnTable">
    <div>
      <table>
        <tr>
          <td>Users</td>
          <td>{{allUsers.length}}</td>
        </tr>
        <tr>
          <td>Registrations</td>
          <td>{{allRegistrations.length}}</td>
        </tr>
        <tr>
          <td>Approved registrations</td>
          <td>{{numberOfApprovedRegistrations}}</td>
        </tr>
        <tr>
          <td>Registrations with spot</td>
          <td>{{numberOfRegistrationsGiven}}</td>
        </tr>
        <tr>
          <td>Inside spots</td>
          <td>{{numberOfInsideRegistrationsGiven}}/{{conInfo.numberOfInsideSpots}} spots<br>{{waitingLists.inside.length}} waiting</td>
        </tr>
        <tr>
          <td>Outside spots</td>
          <td>{{numberOfOutsideRegistrationsGiven}}/{{conInfo.numberOfOutsideSpots}} spots<br>{{waitingLists.outside.length}} waiting</td>
        </tr>

        <!-- </table><table> -->

        <tr>
          <td>Fully paid registrations</td>
          <td>{{numberOfFullyPaidRegistrations}} / {{numberOfRegistrationsGiven}}</td>
        </tr>
        <tr>
          <td>Partially paid regs</td>
          <td>{{numberOfPartiallyPaidRegistrations}} / {{numberOfRegistrationsGiven}}</td>
        </tr>
        <tr>
          <td>Fully unpaid registrations</td>
          <td>{{numberOfRegistrationsGiven - numberOfPartiallyPaidRegistrations - numberOfFullyPaidRegistrations}} / {{numberOfRegistrationsGiven}}</td>
        </tr>

        <!-- </table><table> -->

        <tr>
          <td>Vegans with received spots</td>
          <td>{{numberOfVegans}}</td>
        </tr>
        <tr>
          <td>Fursuiters with received spots</td>
          <td>{{numberOfFursuiters}}</td>
        </tr>

        <tr v-if="conInfo.isSellingHoodies">
          <td>Hoodies, total</td>
          <td>
            <span v-for="(count, size) in numberOfMerch.hoodies.total" :key="size" style="margin-right: 6px;">
              {{size}}: {{count}}
            </span>

            <p v-if="isEmpty(numberOfMerch.hoodies.total)">-</p>
          </td>
        </tr>

        <tr v-if="conInfo.isSellingHoodies">
          <td>Hoodies, paid</td>
          <td>
            <span v-for="(count, size) in numberOfMerch.hoodies.paid" :key="size" style="margin-right: 6px;">
              {{size}}: {{count}}
            </span> 
            
            <p v-if="isEmpty(numberOfMerch.hoodies.paid)">-</p>
          </td>
        </tr>

        <tr v-if="conInfo.isSellingTshirts">
          <td>T-shirts, total</td>
          <td>
            <span v-for="(count, size) in numberOfMerch.tshirts.total" :key="size" style="margin-right: 6px;">
              {{size}}: {{count}}
            </span> 
            
            <p v-if="isEmpty(numberOfMerch.tshirts.total)">-</p>
          </td>
        </tr>

        <tr v-if="conInfo.isSellingTshirts">
          <td>T-shirts, paid</td>
          <td>
            <span v-for="(count, size) in numberOfMerch.tshirts.paid" :key="size" style="margin-right: 6px;">
              {{size}}: {{count}}
            </span> 
            
            <p v-if="isEmpty(numberOfMerch.tshirts.paid)">-</p>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'adminStats',

  props: {
    isOpen: Boolean,
  },

  methods: {
    formatTimestamp (timestamp) {
      return this.timestampFormat === 'short' ? this.formatShortTimestamp(timestamp) : this.formatLongTimestamp(timestamp)
    },

    formatShortTimestamp (timestamp) {
      return new Date(timestamp).toDateString().substr(4,6)
    },

    formatLongTimestamp (timestamp) {
      let tsDate = new Date(timestamp)
      return tsDate.toDateString().substr(4,6) + ', ' + tsDate.toTimeString().substr(0,8)
    },

    isEmpty (someObject) {
      return Object.keys(someObject).length === 0
    }
  },

  computed: {
    ...mapGetters(['conInfo', 'allUsers', 'allRegistrations', 'waitingLists', 'usernamesWithReceivedRooms']),
    
    numberOfInsideRegistrationsGiven () {
      return this.allRegistrations.filter(reg => reg.receivedInsideSpot === true).length
    },

    numberOfOutsideRegistrationsGiven () {
      return this.allRegistrations.filter(reg => reg.receivedOutsideSpot === true).length
    },

    numberOfRegistrationsGiven () {
      return this.numberOfInsideRegistrationsGiven + this.numberOfOutsideRegistrationsGiven
    },

    numberOfApprovedRegistrations () {
      return this.allRegistrations.filter(reg => reg.isAdminApproved === true).length
    },

    usersWithRegistration () {
      return this.allUsers.filter(user => user.registrationId !== null).length
    },

    numberOfFullyPaidRegistrations () {
      return this.allRegistrations.filter(reg => reg.isPaid === true).length
    },

    numberOfPartiallyPaidRegistrations () {
      return this.allRegistrations.filter(reg => !reg.isPaid && reg.paidAmount>0).length
    },

    numberOfVegans () {
      return this.allUsers.filter(user => user.isVegan && this.usernamesWithReceivedRooms.find(username => username===user.username)).length
    },

    numberOfFursuiters () {
      return this.allUsers.filter(user => user.isFursuiter && this.usernamesWithReceivedRooms.find(username => username===user.username)).length
    },

    numberOfMerch () {
      let paidHoodieCounts = {}
      let totalHoodieCounts = {}
      let paidTshirtCounts = {}
      let totalTshirtCounts = {}

      for (var reg of this.allRegistrations) {
        if (reg.buyHoodie === true) {
          let size = reg.hoodieSize
          totalHoodieCounts[size] = ++totalHoodieCounts[size] || 1
          if (reg.isPaid) {
            paidHoodieCounts[size] = ++paidHoodieCounts[size] || 1
          }
        }

        if (reg.buyTshirt === true) {
          let size = reg.tshirtSize
          totalTshirtCounts[size] = ++totalTshirtCounts[size] || 1
          if (reg.isPaid) {
            paidTshirtCounts[size] = ++paidTshirtCounts[size] || 1
          }
        }
      }

      return {
        hoodies: {
          total: totalHoodieCounts,
          paid: paidHoodieCounts
        },
        tshirts: {
          total: totalTshirtCounts,
          paid: paidTshirtCounts
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
#twoColumnTable {
  display: flex;
  flex-direction: row;
  table {
    margin: 8px;
    text-align: left;
    td {
      border: none;
      padding: 4px;
      &:hover {
        cursor: default;
      }
      &:first-child {
        text-align: right;
        padding-right: 10px;
      }
    }
    tr:hover {
      background: none;
    }
  }
}
</style>