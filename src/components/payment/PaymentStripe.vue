<template>
  <div class="shadow-box payment-container">
    <p style="font-size: 20px; margin-bottom: 10px;"><b>Paying {{amount}} NOK</b></p>

    <ResponseMessage :message="stripeResponse.responseMessage" :messageType="stripeResponse.messageType" @closeMessage="closeResponseMessage" v-if="stripeResponse.responseMessage"/>
    <LoadingMessage :message="loadingMessage" v-if="isProcessingPayment || isFetchingPaymentInfo"/>

    <div style="text-align: left;" class="margin-bottom-20">
      <p class="margin-bottom-10">Before submitting your payment, you must consent to Furway's sales terms and conditions, which can be viewed <router-link :to="'/legal'" target="_blank">here</router-link>.</p>

      <input type="checkbox" id="consentToTerms" v-model="hasConsentedToSalesTerms">
      <label for="consentToTerms">I consent to Furway's sales terms and conditions</label>
    </div>

    <div v-show="!isFetchingPaymentInfo && !failedToInitializeStripe" id="stripePaymentContainer">
      <form @submit.prevent="pay">
        <div id="card-element"></div>
        
        <ResponseMessage :message="stripeValidation.responseMessage" :messageType="stripeValidation.messageType" :preventClose="true" @closeMessage="closeResponseMessage" v-if="stripeValidation.responseMessage"/>

        <button type="submit" v-show="!paymentSucceeded" class="big-button theme-button double-button margin-top-10" :class="{'disabled-button': !canPay}">
          <CheckIcon/>Pay
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import paymentApi from '@/api/payment-api'

import ResponseMessage from '@/components/ResponseMessage.vue'
import LoadingMessage from '@/components/LoadingMessage.vue'

import CheckIcon from 'vue-material-design-icons/Check.vue'

export default {
  props: {
    'amount': Number,
  },

  components: {
    ResponseMessage, LoadingMessage,
    CheckIcon,
  },

  computed: {
    canPay () {
      return this.hasConsentedToSalesTerms
    }
  },

  data () {
    return {
      card: undefined,
      paymentMethod: 'credit card',
      hasConsentedToSalesTerms: false,

      clientSecret: undefined,

      loadingMessage: 'Initializing payment process...',

      failedToInitializeStripe: true,
      paymentSucceeded: false,
      isFetchingPaymentInfo: true,
      isProcessingPayment: false,
      stripeValidation: {
        responseMessage: '',
        messageType: 'error'
      },
      stripeResponse: {
        responseMessage: '',
        messageType: 'error'
      },

      stripe: undefined,
    }
  },
 
  methods: {
    async initializePayment () {
      if (this.failedToInitializeStripe) { return }

      let result = await paymentApi.initializePayment()
      this.isFetchingPaymentInfo = false

      if ('error' in result) {
        this.stripeResponse.responseMessage = 'Error fetching amount to pay'
        this.stripeResponse.messageType = 'error'
      }
      else {
        this.clientSecret = result.clientSecret
        this.paymentSucceeded = false
      }
    },

    async pay () {
      if (!this.canPay) { return }
      if (this.isProcessingPayment) { return }

      this.isProcessingPayment = true
      this.loadingMessage = 'Processing payment...'

      let user = this.$store.getters.userData

      let result = await this.stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: {
            name: user.username,
            phone: user.phoneCountryCode + user.phone,
            email: user.email
          },
        }
      })

      if (result.error) {
        this.isProcessingPayment = false
        this.stripeResponse.responseMessage = result.error.message
        this.stripeResponse.messageType = 'error'
      }
      else {
        if (result.paymentIntent.status === 'succeeded') {
          this.storePayment(result.paymentIntent.id)
        }
      }
    },

    async storePayment (paymentId) {
      let result = await paymentApi.storePayment(paymentId)

      this.isProcessingPayment = false

      if ('error' in result) {
        this.stripeResponse.responseMessage = `WARNING: Payment succeeded, but we failed to store this on our servers. Please contact info@furway.no immediately. Don't worry, we just have to manually fix this.`
        this.stripeResponse.messageType = 'error'
      }
      else {
        this.stripeResponse.responseMessage = 'Payment succeeded!'
        this.stripeResponse.messageType = 'success'

        let stripeContainer = document.getElementById('card-element')
        stripeContainer.removeChild(stripeContainer.firstChild)

        this.paymentSucceeded = true
        this.$emit('success')
      }
    },
    
    async closeResponseMessage () {
      this.stripeResponse.responseMessage = ''

      if (this.paymentSucceeded) {
        await this.initializeStripe()
        this.initializePayment
      }
    },

    handleCardChange({error}) {
      if (error) {
        this.stripeValidation.responseMessage = error.message
      }
      else {
        this.stripeValidation.responseMessage = ''
      }
    },

    async initializeStripe () {
      try {
        this.stripe = Stripe('pk_test_LkYCLt0dCvDmTy0hWkBTyf77')
        
        let elements = this.stripe.elements()

        this.card = elements.create('card', {'style': {'base': {'color': '#32325d'}}})
        this.card.mount('#card-element')

        this.card.addEventListener('change', this.handleCardChange)
        this.failedToInitializeStripe = false
      }
      catch (err) {
        this.failedToInitializeStripe = true
        this.isFetchingPaymentInfo = false
        this.stripeResponse.responseMessage = 'Failed to initialize payment, possibly due to missing internet connection'
        this.stripeResponse.messageType = 'info'
      }
    },
  },

  async mounted () {
    await this.initializeStripe()
    this.initializePayment()
  }
}
</script>

<style lang="scss">
.payment-container {
  width: 500px;
  box-sizing: border-box;

  @media screen and (max-width: 849px) {
    width: 95vw;
  }
}
#stripePaymentContainer {
  box-sizing: border-box;

  @media screen and (min-width: 850px) {
    width: 360px;
    margin: auto;
  }
}
</style>