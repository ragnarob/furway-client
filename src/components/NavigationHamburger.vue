<template>
  <div id="navHamburgerWrapper" @click="closeNavMenuByOutsideClick">
    <div id="navHamburger" @click="toggleNavMenuIsOpen">
      <MenuIcon :size="420" v-if="!isNavMenuOpen"/>
      <CloseIcon :size="420" v-if="isNavMenuOpen"/>
    </div>

    <div id="navHamburgerInner" v-show="isNavMenuOpen" @click="navMenuInnerClick">
      <router-link to="/">HOME</router-link>
      <router-link to="/info">INFORMATION</router-link>
      <router-link to="/register">REGISTRATION</router-link>

      <router-link to="/login" v-if="!$store.getters.isLoggedIn">
        LOG IN
      </router-link>
      <router-link to="/signup" v-if="!$store.getters.isLoggedIn">
        SIGN UP
      </router-link>
      <router-link to="/logout" v-if="$store.getters.isLoggedIn">
        LOG OUT
      </router-link>

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
  }
}
</script>

<style lang="scss" scoped>
#test {
  position: absolute;
  top: 0;
  right: 0;
  height: 100px;
}

#navHamburger {
  position: absolute;
  top: 0; right: 0;
  font-size: 40px;
  width: 40px; 
  padding: 0 4px;
  z-index: 10;

  &:hover {
    cursor: pointer;
  }

  @media screen and (min-width: 850px) {
    display: none !important;
  }
}

#navHamburgerInner {
  position: absolute;
  z-index: 5;
  top: 0;
  right: 0;
  padding: 16px 56px 16px 16px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);

  a {
    margin: 1px auto;
    padding: 6px;
    &:hover {
      background: rgba(0,0,0,0.05);
    }
  }
}
</style>