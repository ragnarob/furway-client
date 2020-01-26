<template>
  <div class="loading-message" id="loadingMessage">
    <p>{{displayedMessage}}</p>
  </div>
</template>

<script>
import LoadingIcon from 'vue-material-design-icons/DotsHorizontal.vue'

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
      rotatedDegrees: 0,
      divToAnimate: undefined,
      animationHook: undefined,
      isExpanded: false,
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
  },

  methods: {
    animateDiv () {
      if (this.isExpanded) {
        document.getElementById('loadingMessage').style.padding = '12px 20px'
        // document.getElementById('loadingMessage').style.color = 'white'
      }
      else {
        document.getElementById('loadingMessage').style.padding = '12px 30px'
        // document.getElementById('loadingMessage').style.color = 'black'
      }
      this.isExpanded = !this.isExpanded
    }
  },

  mounted () {
    this.divToAnimate = document.getElementById('rotatingIcon')
    this.animateDiv()
    this.animationHook = setInterval(this.animateDiv, 700)
  },

  beforeDestroy () {
    clearInterval(this.animationHook)
  }
}
</script>

<style lang="scss">
.loading-message {
  display: flex; 
  padding: 12px 20px;
  color: white;
  margin: 10px auto;
  width: fit-content;
  box-sizing: border-box;
  background-color: rgb(45, 101, 175);

  -webkit-transition: all 0.7s linear;
  -moz-transition: all 0.7s linear;
  -o-transition: all 0.7s linear;
  transition: all 0.7s linear;

  p, span {
    font-weight: 600;
  }
}
</style>