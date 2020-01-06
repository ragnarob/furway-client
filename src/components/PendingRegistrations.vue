<template>
  <table>
    <tr>
      <th>Username</th>
      <th>First name</th>
      <th>Last name</th>
      <th>Room pref</th>
      <th>Submitted</th>
      <th>Action</th>
    </tr>
    <tr v-for="reg in pendingRegistrations" :key="reg.id" :class="{'highlighted-row': reg.username === highlightedUsername}">
      <td>{{reg.username}}</td>
      <td>{{reg.firstName}}</td>
      <td>{{reg.lastName}}</td>
      <td>{{formatRoomPreference(reg.roomPreference)}}</td>
      <td>{{formatTimestamp(reg.timestamp)}}</td>
      <td>
        <button @click="approveRegistration(reg)">Approve</button>
        <button @click="rejectRegistration(reg)">Reject</button>
        <button @click="highlightUser(reg.username)">Show full user</button>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
}
</script>