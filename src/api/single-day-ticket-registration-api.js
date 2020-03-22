import Axios from 'axios'

let apiBase = '/api'

export default {
  async getAllRegistrations () {
    let response = await Axios.get(`${apiBase}/registrations`)

    return response.data
  },

  async getRegistrationSpotsLeft () {
    let response = await Axios.get(`${apiBase}/single-day-registration-spots-left`)

    return response.data
  },

  async submitSingleDayTicketRegistration (userId, days) {
    let response = await Axios.post(`${apiBase}/single-day-registrations/user/${userId}`, {'days': days})

    return response.data
  }
}