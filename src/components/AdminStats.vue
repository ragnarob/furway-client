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

        </table><table>

        <tr>
          <td>Fully paid registrations</td>
          <td>{{numberOfFullyPaidRegistrations}} / {{numberOfRegistrationsGiven}}</td>
        </tr>
        <tr>
          <td>Main days paid, add-ons unpaid regs</td>
          <td>{{numberOfOnlyAddonsUnpaidRegistrations}} / {{numberOfRegistrationsGiven}}</td>
        </tr>
        <tr>
          <td>Fully unpaid registrations</td>
          <td>{{numberOfRegistrationsGiven - numberOfMainDaysPaidRegistrations}} / {{numberOfRegistrationsGiven}}</td>
        </tr>
      </table>

      <table>
        <tr>
          <td>Vegans with received spots</td>
          <td>{{numberOfVegans}}</td>
        </tr>
        <tr>
          <td>Fursuiters with received spots</td>
          <td>{{numberOfFursuiters}}</td>
        </tr>
      </table>
    </div>

    <div>
      <table>
        <tr>
          <td>Registration opening date</td>
          <td>{{formatShortTimestamp(conInfo.registrationOpenDate)}}<br>Volunteers: {{formatShortTimestamp(conInfo.volunteerRegistrationOpenDate)}}</td>
        </tr>
        <tr>
          <td>Registration close date</td>
          <td>{{formatShortTimestamp(conInfo.registrationCloseDate)}}</td>
        </tr>
        <tr>
          <td>Soft Main payment deadline</td>
          <td>{{formatShortTimestamp(conInfo.originalPaymentDeadline)}}</td>
        </tr>
        <tr>
          <td>Final main payment deadline</td>
          <td>{{formatShortTimestamp(conInfo.finalRegPaymentDeadline)}}</td>
        </tr>
        <tr>
          <td>Add-ons payment deadline</td>
          <td>{{formatShortTimestamp(conInfo.addonPaymentDeadline)}}</td>
        </tr>

        </table><table>

        <tr>
          <td>Main days price</td>
          <td>{{conInfo.mainDaysPriceNok}}</td>
        </tr>
        <tr>
          <td>Early/late price</td>
          <td>{{conInfo.earlyArrivalPriceNok}}/{{conInfo.lateDeparturePriceNok}}</td>
        </tr>
        <tr v-if="conInfo.isSellingHoodies">
          <td>Hoodie price</td>
          <td>{{conInfo.hoodiePriceNok}}</td>
        </tr>
        <tr v-if="conInfo.isSellingTshirts">
          <td>T-shirt price</td>
          <td>{{conInfo.tshirtPriceNok}}</td>
        </tr>
      </table>

      <table>
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

    numberOfMainDaysPaidRegistrations () {
      return this.allRegistrations.filter(reg => reg.isMainDaysPaid === true).length
    },

    numberOfFullyPaidRegistrations () {
      return this.allRegistrations.filter(reg => reg.isMainDaysPaid === true && reg.isAddonsPaid === true).length
    },

    numberOfOnlyAddonsUnpaidRegistrations () {
      return this.allRegistrations.filter(reg => reg.isMainDaysPaid === true && reg.isAddonsPaid === false).length
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
          if (reg.isHoodiePaid) {
            paidHoodieCounts[size] = ++paidHoodieCounts[size] || 1
          }
        }

        if (reg.buyTshirt === true) {
          let size = reg.tshirtSize
          totalTshirtCounts[size] = ++totalTshirtCounts[size] || 1
          if (reg.isTshirtPaid) {
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
    }
    tr:hover {
      background: none;
    }
  }

  div:first-child {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 50%;
    padding-right: 10px;
  }

  div:nth-child(2) {
    width: 50%;
    padding-left: 10px;
  }
}
</style>