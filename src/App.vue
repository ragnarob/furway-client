<template>
  <div id="app">
    <router-view/>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/admin">Admin</router-link> |
      <router-link to="/my-profile">MyProfile</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/signup">Create user</router-link> |
      <router-link to="/register">Register</router-link> |
      <router-link to="/my-registration">My Registration</router-link>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('loadConInfo')
    this.$store.dispatch('refreshUserData')
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

table {
  border-collapse: collapse;
}
td, th {
  border: 0.5px solid #aaa;
  padding: 2px 4px;
}
.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error-message {
  color: red;
}
.link-text {
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
}
</style>
