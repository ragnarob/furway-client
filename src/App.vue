<template>
  <div id="app">
    <Navigation/>
    <NavigationHamburger/>
    <router-view/>
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'
import NavigationHamburger from './components/NavigationHamburger.vue'

export default {
  components: {
    Navigation, NavigationHamburger,
  },

  data: function () {
    return {
    }
  },

  mounted () {
    this.$store.dispatch('loadConInfo')
    this.$store.dispatch('refreshUserData')

    console.log(`Hi there - hope you find the website satisfactory.`)
    console.log(`New features are still being developed.`)
    console.log(`If you find any errors, @Malann_kitty (Twitter) love to hear about them!`)
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Raleway:300,400,600&display=swap');

body {
  // background-color: #222;
  color: #333;

  ::selection {
    background-color: #59f8b19d;
  }
}

body, div, td, th, table, span, p, button, textarea {
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
  padding-bottom: 20px;
  padding-top: 44px;
}

a {
  color: #35b886;
}

#nav, #navHamburgerInner {
  a, p {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    width: 100%;
    color: default;
    display: inline;

    &.router-link-exact-active {
      color: #35b886;
    }
  }
}

.tiny-info {
  font-size: 10px;
  font-style: italic;
}

div, p, span, h1, h2, h3, h4, html, body {
  margin: 0;
  padding: 0;
}
h1, h2, h3 {
  margin-top: 20px;
  margin-bottom: 4px;
}
h3 {
  font-size: 22px;
}
@media screen and (max-width: 850px) {
  p {
    font-size: 16px;
    font-weight: 300;
  }
  h1 {
    font-size: 30px;
    text-align: center;
  }
  h2 {
    font-size: 24px;
  }
}
.no-margin-top {
  margin-top: 0px !important;
}
.no-margin {
  margin: 0px !important;
}
.margin-top-10 {
  margin-top: 10px;
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
th, .th {
  padding: 8px 10px;
  background-color: #e2e2e2;
  &:hover {
    cursor: default;
  }
}
tr:hover {
  background-color: rgba(0,0,0,0.07);
}
.centered-td {
  text-align: center;
}
.padded-table {
  td {
    padding: 6px 8px;
  }
}
.long-text-cell {
  max-width: 160px;
  white-space: pre-wrap;
}

.left-align {
  align-self: flex-start;
  margin-left: 0px;
}
.in-text-image {
  max-width: 320px;
  @media screen and (max-width: 849px) {
    max-width: 60%;
  }
  margin: 0px auto;
}
.in-text-image-smaller {
  max-width: 280px;
  @media screen and (max-width: 849px) {
    max-width: 50%;
  }
  margin: 0px auto;
}
.artwork-credit {
  margin-top: 2px;
  font-size: 12px;
  margin-bottom: 8px;
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

.wide-table-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.scrolling-table {
  width: fit-content;
  border-collapse: collapse;
  display: block;
  overflow-x: auto;
  white-space: nowrap;
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
input, textarea, select {
  padding: 3px 6px;
  border-radius: 3px;
  border: 1px solid #aaa;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #35b886;
  }

  &.error-input {
    border-color: rgb(218, 22, 22) !important;
  }
}

button {
  font-size: 14px;
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

.small-box-shadow {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
}

.big-button {
  padding: 8px 14px;
  font-size: 15px;
  font-weight: 600;
}

.theme-button {
  background-color: #35b886;
  color: white;
}

.neutral-button {
  // background-color: #d1d1d1;
  color: #35b886;
}

.disabled-button {
  background-color: #bbb !important;
  color: #444;
  box-shadow: none !important;
  &:hover {
    cursor: not-allowed !important;
  }
}

.required-input {
  border-left-width: 7px;
}

.show-hide-icon {
  padding: 0 8px;
  border-radius: 30px;
  &:hover {
    cursor: pointer;
    color: rgb(16, 172, 107);
  }
}

.error-message, .success-message, .info-message {
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

.left-aligned-content {
  display: flex;
  width: fit-content;
  margin: auto;
  align-items: flex-start;
}

.full-width-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  max-width: 800px;

  @media screen and (max-width: 849px) {
    max-width: 90%;
  }

  h3 {
    margin-top: 30px;
  }
  h3, h4 {
    align-self: flex-start;
    text-align: left;
  }

  p {
    text-align: justify;
    align-self: flex-start;
  }
  @media screen and (max-width: 850px) {
    p {
      text-align: left;
    }
  }
}

.error-message {
  background-color: rgb(228, 94, 94);
}
.success-message {
  background-color: rgb(50, 133, 47);
}
.info-message {
  background-color: rgb(45, 101, 175);
}
.incorrect-field-error {
  font-size: 12px;
  margin-top: 2px;
  font-style: italic;
  color: rgb(218, 22, 22);
}

.icon-button {
  span {
    margin: 3px 0 5px 0;
  }
  border-radius: 30px;
  font-size: 20px;
  &:hover {
    cursor: pointer;
    background: rgba(0,0,0,0.1);
  }
}
.icon-button-small {
  margin-left: 8px;
  margin-right: 0px;
  font-size: 14px;
  span {
    margin: 1px -2px 3px -2px;
  }
}
.left-aligned-text {
  text-align: left;
  h3, h4, p {
    align-self: flex-start;
  }
}
.left-pad-16 {
  padding-left: 16px !important;
}
</style>
