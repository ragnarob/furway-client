import Axios from 'axios'

let apiBase = '/api'

export default {
  async initializePayment () {
    let response = await Axios.get(`${apiBase}/payments/initialize`)

    return response.data
  },

  async storePayment (paymentId) {
    let response = await Axios.post(`${apiBase}/payments/complete`, {paymentId})

    return response.data
  },
}