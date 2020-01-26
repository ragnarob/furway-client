<template>
  <div class="loading-message">
    <LoadingIcon title="'Loading'"/>
    <p>{{displayedMessage}}</p>
  </div>
</template>

<script>
import LoadingIcon from 'vue-material-design-icons/Loading.vue'

export default {
  components: {
    LoadingIcon,
  },

  props: {
    'message': String,
    'messageType': String,
  },

  data: function () {
    return {
    }
  },

  computed: {
    displayedMessage () {
      if (!this.message) {
        return 'Loading...'
      }
      else {
        return this.message
      }
    }
  }
}
</script>

<style lang="scss">
.loading-message {
  display: flex; 
  flex-direction: row;
  padding: 12px 20px;
  color: white;
  margin: 10px auto;
  width: fit-content;
  background-color: rgb(45, 101, 175);

  p, span {
    font-weight: 600;
  }
  
  span {
    margin-bottom: 3px;
    margin-left: -4px;
    margin-right: 8px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>