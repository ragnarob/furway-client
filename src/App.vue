<template>
  <div id="app">
    <router-view/>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/admin">Admin</router-link> |
      <router-link to="/my-profile">MyProfile</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/signup">Create user</router-link> |
      <router-link to="/register">Registration</router-link> |
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
@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600|Raleway:300,400,600&display=swap');

body {
  // background-color: #222;
  color: #333;
}

body, div, td, th, table, span, p, button {
  font-family: 'Raleway', sans-serif;
  font-weight: 400;
}
th {
  font-weight: 600;
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

div, p, span, h1, h2, h3, h4 {
  margin: 0;
  padding: 0;
}
h1, h2 {
  margin-top: 20px;
  margin-bottom: 4px;
}
table {
  margin: 0 auto;
  width: fit-content;
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
.flex-row {
  display: flex;
  flex-direction: row;
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
  width: 100%;

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
.table-without-buttons {
  td {
    padding: 4px 8px;
  }
}

button {
  font-size: 14px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #fff;
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

.show-hide-icon {
  padding: 0 8px;
  border-radius: 30px;
  &:hover {
    cursor: pointer;
    color: rgb(16, 172, 107);
  }
}

.error-message, .success-message {
  display: flex; 
  flex-direction: row;
  padding: 12px 20px;
  color: white;
  margin: 10px auto;

  p, span {
    font-weight: 600;
  }
  
  span {
    margin-bottom: 3px;
    margin-left: 8px;
    margin-right: -4px;

    &:hover {
      cursor: pointer;
    }
  }
}

.error-message {
  background-color: rgb(228, 94, 94);
}
.success-message {
  background-color: rgb(50, 172, 45);
}
</style>
