<template>
<div id="navWrapper">
  <header id="nav">
    <router-link to="/">HOME</router-link>
    <router-link to="/info">INFORMATION</router-link>
    <router-link to="/register">REGISTRATION</router-link>

    <router-link to="/login" v-if="!$store.getters.isLoggedIn">
      LOG IN
    </router-link>
    <router-link to="/signup" v-if="!$store.getters.isLoggedIn">
      SIGN UP
    </router-link>
    <p to="/" v-if="$store.getters.isLoggedIn" @click="logout" class="link-text">
      LOG OUT
    </p>
    <router-link to="/my-profile" v-if="$store.getters.isLoggedIn">
      MY PROFILE
    </router-link>
    <router-link to="/my-registration" v-if="$store.getters.isLoggedIn">
      MY REGISTRATION
    </router-link>
    <router-link to="/admin" v-if="$store.getters.isLoggedIn && ($store.getters.userData.isAdmin || $store.getters.userData.isDriver)">
      ADMIN
    </router-link>
  </header>
</div>
</template>

<script>
import userApi from '../api/user-api'

export default {
  name: 'navigation',

  components: {

  },

  data: function () {
    return {
    }
  },
  
  methods: {
    logout () {
      this.$router.push('/')
      this.$store.dispatch('logout')
      userApi.logout()
    }
  }
}
</script>

<style lang="scss">
#navWrapper {
  position: fixed;
  top: 0;
  z-index: 3;
  width: 100%;

  @media screen and (max-width: 849px) {
    display: none !important;
  }
}
#nav {
  margin: auto;
  width: fit-content;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  padding: 16px 20px;
  a, p {
    font-size: 14px;
    margin: auto 1px;
    padding: 8px 10px !important;
    border-radius: 10px;
    &:hover {
      background: rgba(0,0,0,0.05);
    }
  }
}

html:not([data-scroll='0']) {
  header {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    background: rgba(255,255,255,1) !important;
  }
  #navHamburger {
    background: rgba(255,255,255,1) !important;
  }
}
</style>