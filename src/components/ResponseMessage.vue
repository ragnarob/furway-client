<template>
  <div :class="{'error-message': messageType==='error', 'success-message': messageType==='success', 'info-message': messageType==='info'}" 
       v-show="message && message.length > 0">
    <p>{{message}}</p>
    <CloseIcon @click="closeMessage"/>
  </div>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/CloseCircle.vue'

export default {
  components: {
    CloseIcon,
  },

  props: {
    message: String,
    messageType: String,
  },

  data: function () {
    return {
    }
  },

  methods: {
    closeMessage () {
      this.$emit('closeMessage')
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  width: fit-content;
}
</style>