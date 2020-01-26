<template>
  <div :class="{'error-message': messageType==='error', 'success-message': messageType==='success', 'info-message': messageType==='info'}" 
       v-show="message && message.length > 0"
       id="responseMessageContainer">
    <p>{{message}}</p>
    <CloseIcon @click="closeMessage" title="Close"/>
  </div>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/CloseCircle.vue'

export default {
  components: {
    CloseIcon,
  },

  props: {
    'message': String,
    'messageType': String,
  },

  data: function () {
    return {
    }
  },

  methods: {
    closeMessage () {
      this.$emit('closeMessage')
    }
  },
}
</script>

<style lang="scss">
.error-message, .success-message, .info-message {
  display: flex; 
  flex-direction: row;
  padding: 12px 20px;
  color: white;
  margin: 10px auto;
  width: fit-content;

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
  background-color: rgb(50, 133, 47);
}
.info-message {
  background-color: rgb(45, 101, 175);
}
</style>