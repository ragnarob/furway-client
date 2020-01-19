<template>
  <div v-show="isOpen">
    <h3>Inside waiting list</h3>
    <table class="table-without-buttons" v-if="waitingLists.inside.length > 0">
      <thead>
        <th>Position</th>
        <th>Username</th>
        <th>Ticket type</th>
        <th>Registration time</th>
      </thead>
      <tr v-for="(reg, index) in waitingLists.inside" :key="reg.id">
        <td>{{index+1}}</td>
        <td>{{reg.username}}</td>
        <td>{{formatRoomPreference(reg.roomPreference)}}</td>
        <td>{{formatTimestamp(reg.timestamp)}}</td>
      </tr>
    </table>
    <p v-else>No waiting inside list</p>

    <h3>Outside waiting list</h3>
    <table class="table-without-buttons" v-if="waitingLists.outside.length > 0">
      <thead>
        <th>Position</th>
        <th>Username</th>
        <th>Ticket type</th>
        <th>Registration time</th>
      </thead>
      <tr v-for="(reg, index) in waitingLists.outside" :key="reg.id">
        <td>{{index+1}}</td>
        <td>{{reg.username}}</td>
        <td>{{formatRoomPreference(reg.roomPreference)}}</td>
        <td>{{formatTimestamp(reg.timestamp)}}</td>
      </tr>
    </table>
    <p v-else>No waiting outside list</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'waitingLists',
  

  props: {
    isOpen: Boolean,
    isInAdminPanel: Boolean,
  },

  data: function () {
    return {
    }
  },

  computed: {
    ...mapGetters(['waitingLists', 'timestampFormat'])
  },

  methods: {
    formatRoomPreference (roomPreference) {
      if (roomPreference === 'insideonly') { return 'Inside only' }
      else if (roomPreference === 'outsideonly') { return 'Outside only' }
      else { return 'Inside preference' }
    },

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
  },
}
</script>

<style lang="scss" scoped>
table {
  padding: 4px 6px;
  width: fit-content;
  margin: auto;
}
</style>