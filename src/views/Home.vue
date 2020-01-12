<template>
  <div>
    <div id="mainPictureBackground">
      <div id="mainPictureInner">
        <div>
          <h1>Furway 2020</h1>
          <p>17. - 19. July</p>
          <p>(16. - 20. July with Early & Late)</p>
          <p v-if="!isRegistrationOpen" class="registration-countdown">
            Registration opens in {{timeUntilRegistrationString}}
          </p>
        </div>

        <div id="twitterLink">
          <a href="https://twitter.com/FurwayCon">
            <TwitterIcon/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TwitterIcon from 'vue-material-design-icons/TwitterCircle.vue'

export default {
  name: 'home',

  components: {
    TwitterIcon
  },

  data: function () {
    return {
      originalNavTopLineBackground: ''
    }
  },

  computed: {
    isRegistrationOpen () {
      return  new Date() > new Date(this.$store.getters.conInfo.registrationOpenDate)
    },

    timeUntilRegistrationString () {
      if (this.isRegistrationOpen) { return 0 }
      let remainingSeconds = (new Date(this.$store.getters.conInfo.registrationOpenDate) - new Date ())/1000
      let remainingDays = Math.floor(remainingSeconds/(86400))
      let remainingHours = Math.floor((remainingSeconds-remainingDays*86400)/3600)
      let remainingMinutes = Math.ceil((remainingSeconds-remainingDays*86400-remainingHours*3600)/60)
      return `${remainingDays} days, ${remainingHours} hours, ${remainingMinutes} minutes`
    },
  },

  mounted () {
    let navTopLine = document.getElementById('navTopLine')
    this.originalNavTopLineBackground = navTopLine.style.background
    navTopLine.style.background = 'transparent'

    document.getElementById('furwayHeader').style.visibility = 'hidden'
  },

  beforeDestroy () {
    document.getElementById('navTopLine').style.background = this.originalNavTopLineBackground

    document.getElementById('furwayHeader').style.visibility = 'visible'
  },
}
</script>

<style lang="scss" scoped>
#mainPictureBackground {
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  @media screen and (max-width: 849px) {
    background-image: url('../assets/bg-small.jpg');
  }
  @media screen and (min-width: 850px) {
    background-image: url('../assets/bg-big.jpg');
  }
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #464646;
}
#mainPictureInner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  background: rgba(93, 103, 107, 0.6);
  width: 100%;
  height: 100%;
  h1 {
    font-size: 100px;
  }
  p {
    font-weight: 400;
    font-size: 23px;
    margin: 20px auto;
  }
  @media screen and (max-width: 850px) {
    h1 {
      font-size: 52px;
    }
    p {
      font-size: 20px;
    }
  }
}
#navTopLine {
  background: red !important;
}
#twitterLink {
  position: absolute;
  bottom: 100px;
  font-size: 60px;
  a {
    color: white;
    text-decoration: none;
  }
  @media screen and (max-width: 850px) {
    bottom: 60px;
    font-size: 50px;
  }
}
</style>
