<template>
  <footer class="footer">
    <div class="footer-inner">
      <p>Contact: info@furway.no</p>
      <p>Org. no 921440898</p>
      <router-link :to="'/legal'" style="text-decoration: none; margin-bottom: -2px;">
        Terms and conditions
      </router-link>
    </div>
  </footer>
</template>

<style lang="scss">
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  background: transparent;
}
.footer-inner {
  width: 100%;
  height: 34px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
  margin-top: 20px;
  padding: 8px 4px;
  box-sizing: border-box;
  background-color: rgba(111,111,111,0.1);

  p, a {
    margin: 0 16px;
    font-size: 12px;
  }
}
</style>