<template>
  <div class="margin-top-20">
    <p><b>Choose your payment method:</b></p>
    <div id="paymentMethodSelector" class="margin-top-4 margin-bottom-20">
      <div @click="paymentMethod = 'stripe'" class="payment-method" :class="{'selected-method': paymentMethod === 'stripe'}">
        <CardIcon/> 
        <p class="margin-left-4">Credit card</p>
      </div>
      <div class="payment-method" :class="{'selected-method': paymentMethod === 'vipps'}">
        <div>
          <p>Vipps</p>
          <p style="font-size: 13px; font-style: italic;">Coming soon!</p>
        </div>
      </div>
    </div>

    <PaymentStripe v-if="paymentMethod === 'stripe'" @success="onPaymentSuccess" :amount="amount"/>
    <PaymentVipps v-if="paymentMethod === 'vipps'"/>
  </div>  
</template>

<script>
import PaymentStripe from './PaymentStripe.vue'
import PaymentVipps from './PaymentVipps.vue'

import CardIcon from 'vue-material-design-icons/CreditCard.vue'

export default {
  name: 'payment',

  components: {
    PaymentStripe, PaymentVipps,
    CardIcon,
  },

  props: {
    amount: Number,
  },

  data: function () {
    return {
      paymentMethod: undefined,
    }
  },

  methods: {
    async onPaymentSuccess () {
      this.paymentMethod = undefined
      this.$emit('success')
    }
  }
}
</script>

<style lang="scss">
#paymentMethodSelector {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;

  .payment-method {
    margin: 0 4px;
    padding: 0 16px;
    height: 100%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }

    span {
      margin-bottom: 3px;
    }

    &.selected-method {
      color: #35b886;
      border: 1px solid #35b886;
    }
  }
}
</style>