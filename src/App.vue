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
body {
  background-color: #222;
  color: #ccc;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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

div, p, span {
  margin: 0;
  padding: 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  display: block;
  overflow-x: auto;
  white-space: nowrap;
}
td, th {
  border: 0.5px solid #aaa;
  padding: 2px 4px;
}
.long-text-cell {
  max-width: 150px;
  word-wrap: break-word;
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

.very-wide-table {
  input[type=text] {
    width: 100px;
  }
  .cell-with-radio {
    display: grid;
    grid-template-columns: auto auto;
    text-align: left;
    padding-right: 4px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
  .non-editable-cell {
    opacity: 0.5;
  }
}
</style>
