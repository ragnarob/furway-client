<template>
  <div :class="{'error-message': isError, 'success-message': !isError}">
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
    isError: Boolean,
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