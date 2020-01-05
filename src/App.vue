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
  // background-color: #222;
  color: #333;
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
  font-size: 14px;
  button {
    margin: 2px 4px;
  }
}
td, th {
  border: 1px solid #e2e2e2;
  padding: 2px 4px;
}
th {
  padding: 8px 10px;
  background-color: #e2e2e2;
  font-weight: normal;
  &:hover {
    cursor: default;
  }
}
tr:hover {
  background-color: rgba(0,0,0,0.07);
}
.long-text-cell {
  max-width: 160px;
  white-space: pre-wrap;
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
.highlighted-row {
  background-color: rgba(167, 255, 167, 0.411) !important;
  &:hover {
    background-color: rgba(129, 233, 129, 0.425) !important;
  }
}
.highlighted-row-blue {
  background-color: rgba(167, 208, 255, 0.411) !important;
  &:hover {
    background-color: rgba(134, 187, 248, 0.411) !important;
  }
}
button {
  font-size: 14px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #fff;
  font-weight: 300;
  color: black;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  &:hover {
    cursor: pointer;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    &.button-disabled {
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    }
  }
}
</style>
