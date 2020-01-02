<template>
  <div>
    <span v-if="!$store.state.isLoggedIn">
      Not logged in. Won't be accessible in final version in this case.
    </span>

    <span v-else>
      <h1>User page: {{$store.state.userData.username}}</h1>

      <div v-if="$store.state.signupSuccess">
        User successfully created!
      </div>

      User info here, pretty version. <br/><br/>
      {{$store.state.userData}}
    </span>

    <button @click="logout">Log out</button>
  </div>
</template>

<script>
import userApi from '../api/user-api'
export default {
  name: 'myProfile',

  methods: {
    logout () {
      userApi.logout()
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>
