<template>
  <div>
    <div id="mainPictureBackground">
      <div id="mainPictureInner">
        <!-- <div :class="{'floating-message': true, 'expanded-floating': isFloatingBoxExpanded}">
          <p @click="isFloatingBoxExpanded = !isFloatingBoxExpanded" class="floating-box-clickable no-margin">
            <DownIcon v-if="!isFloatingBoxExpanded"/><UpIcon v-if="isFloatingBoxExpanded"/>
            We need volunteers!
            <DownIcon v-if="!isFloatingBoxExpanded"/><UpIcon v-if="isFloatingBoxExpanded"/>
          </p>
          <div v-if="isFloatingBoxExpanded">
            <p style="margin-top: 6px;">We are in need of kitchen volunteers! Volunteering means you'll help cook specific meals (lunches, breakfasts or dinners) for up to few hours. Contact <a href="https://t.me/NeraSuncloud">@Leophan</a> on Telegram for more info.</p>
            <p>Want to host an event? If you have an idea, big or small, contact <a href="https://t.me/NeraSuncloud">@NeraSuncloud</a> on Telegram.</p>
            <p class="no-margin">In return for volunteering you'll get to <b>pre-register</b>, guaranteeing you any kind of ticket you want!</p>
          </div>
        </div> -->

        <div id="mainPageInfoText">
          <h1>Furway 2020</h1>
          <p>17. - 19. July</p>
          <p>(16. - 20. July with Early & Late)</p>
          <p v-if="!isRegistrationOpen" class="registration-countdown">
            Registration opens in {{timeUntilRegistrationString}}
          </p>
        </div>

        <div id="twitterLink">
          <a href="https://twitter.com/FurwayCon">
            <TwitterIcon title="Twitter"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TwitterIcon from 'vue-material-design-icons/TwitterCircle.vue'
import DownIcon from 'vue-material-design-icons/ChevronDown.vue'
import UpIcon from 'vue-material-design-icons/ChevronUp.vue'

export default {
  name: 'home',

  components: {
    TwitterIcon, DownIcon, UpIcon
  },

  data: function () {
    return {
      originalNavTopLineBackground: '',
      isFloatingBoxExpanded: false,
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

  #mainPageInfoText {
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

.floating-message {
  position: fixed;
  top: 20%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 6px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  max-width: 500px;
  p {
    color: #222;
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 400;
  }
  &.expanded-floating {
    background: rgba(255, 255, 255, 0.85);
    padding: 6px 10px 6px 10px;
  }
  @media screen and (max-width: 850px) {
    max-width: 98%;
    p {
      font-size: 14px;
    }

    &.expanded-floating {
    background: rgba(255, 255, 255, 0.93);
      left: 0;
      margin: 0 20px;
    }
  }
}
.floating-box-clickable {
  color: #35b886 !important;
  font-weight: 600 !important;
  &:hover {
    cursor: pointer;
  }
}
</style>
