<template>
  <div>
    <div id="mainPictureBackground">
      <div id="mainPictureInner">
        <div>
          <h1>Furway 2020</h1>
          <p>17. - 19. July</p>
          <p>(16. - 20. July with Early & Late)</p>
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
  background-image: url('https://i.imgur.com/rMRebuW.jpg');
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
  background: rgba(93, 103, 107, 0.5);
  width: 100%;
  height: 100%;
  h1 {
    font-size: 100px;
  }
  p {
    font-weight: 400;
    font-size: 20px;
    margin: 20px;
  }
  @media screen and (max-width: 850px) {
    h1 {
      font-size: 50px;
    }
    p {
      font-size: 18px;
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
