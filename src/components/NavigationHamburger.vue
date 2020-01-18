<template>
  <div id="navHamburgerWrapper" @click="closeNavMenuByOutsideClick">
    <div id="navHamburgerBackdrop" v-if="isNavMenuOpen" @click="closeNavMenuByOutsideClick"></div>

    <div id="navTopLine">
      <div id="furwayHeader" @click="goToMain">
        <img src="../assets/logo.png" style="height: 40px"/> Furway
      </div>
      <div id="navHamburger" @click="toggleNavMenuIsOpen" :class="{'small-box-shadow': !isNavMenuOpen}">
        <MenuIcon :size="420" v-if="!isNavMenuOpen"/> <p v-show="!isNavMenuOpen">Menu</p>
      </div>
    </div>

    <div id="navHamburgerInner" v-show="isNavMenuOpen" @click="navMenuInnerClick">
      <span id="closeButtonContainer">
        <CloseIcon :size="420" /> <p>Close</p>
      </span>

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
      <router-link to="/admin" v-if="$store.getters.isLoggedIn && $store.getters.userData.isAdmin">
        ADMIN
      </router-link>
    </div>
  </div>
</template>

<script>
import userApi from '../api/user-api'

import MenuIcon from 'vue-material-design-icons/Menu.vue'
import CloseIcon from 'vue-material-design-icons/Close.vue'

export default {
  name: 'navigationHamburger',

  components: {
    MenuIcon, CloseIcon,
  },

  data: function () {
    return {
      isNavMenuOpen: false,
    }
  },

  methods: {
    closeNavMenuByOutsideClick (clickEvent) {
      this.isNavMenuOpen = false
    },

    toggleNavMenuIsOpen (clickEvent) {
      clickEvent.stopPropagation()
      this.isNavMenuOpen = !this.isNavMenuOpen
    },

    navMenuInnerClick (clickEvent) {
      // clickEvent.stopPropagation()
    },

    goToMain () {
      if (this.$router.currentRoute.path !== '/') {
        this.$router.push('/')
      }
    },
    
    logout () {
      this.$router.push('/')
      this.$store.dispatch('logout')
      userApi.logout()
    }
  }
}
</script>

<style lang="scss">
#navHamburgerBackdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  &:hover {
    cursor: pointer;
  }
  background: rgba(109, 109, 109, 0.6);
}

#test {
  position: absolute;
  top: 0;
  right: 0;
  height: 100px;
}

#navTopLine {
  position: fixed;
  top: 0;
  left: 0;
  height: 54px;
  width: 100%;
  background: #236145dc;
  z-index: 2;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media screen and (min-width: 850px) {
    display: none !important;
  }

  #furwayHeader {
    margin-left: 20px;
    font-weight: 600;
    font-size: 18px;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      margin-right: 8px;
    }
  }
}

#navHamburger {
  font-size: 30px;
  margin-right: 6px;
  padding: 0px 12px 0px 10px;
  z-index: 10;
  background: #fff;
  border-radius: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: fit-content;
  justify-self: flex-end;

  span {
    margin-bottom: 7px;
    margin-right: 2px;
  }

  p {
    font-size: 18px;
  }

  &:hover {
    cursor: pointer;
  }
}

#navHamburgerInner {
  position: fixed;
  top: 0;
  z-index: 5;
  right: 0;
  padding: 10px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

  a, p {
    margin: 4px auto;
    padding: 6px 2px;
    &:hover {
      background: rgba(0,0,0,0.05);
    }
  }

  #closeButtonContainer {
    display: flex;
    flex-direction: row;
    margin: auto;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;

    span {
      margin-bottom: 7px;
      font-size: 30px;
    }
  }
}
</style>