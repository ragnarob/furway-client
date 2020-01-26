import Axios from 'axios'

// let apiBase = 'http://localhost:8088'
let apiBase = '/api'

export default {
  async getAllRegistrations () {
    let response = await Axios.get(`${apiBase}/registrations`)

    return response.data
  },

  async getPendingRegistrations () {
    let response = await Axios.get(`${apiBase}/registrations/pending`)

    return response.data
  },

  async getRegistrationById (userId) {
    let response = await Axios.get(`${apiBase}/registrations/user/${userId}`)

    return response.data
  },

  async getWaitingLists () {
    let response = await Axios.get(`${apiBase}/waitinglist`)

    return response.data
  },

  async submitRegistration (userId, registrationData) {
    let response = await Axios.post(`${apiBase}/registrations/user/${userId}`, registrationData)

    return response.data
  },

  async updateRegistration(userId, registrationData) {
    let response = await Axios.post(`${apiBase}/registrations/user/${userId}/update`, registrationData)

    return response.data
  },

  async approveRegistration (userId) {
    let response = await Axios.post(`${apiBase}/registrations/user/${userId}/approve`)

    return response.data
  },

  async rejectRegistration (userId) {
    let response = await Axios.post(`${apiBase}/registrations/user/${userId}/reject`)

    return response.data
  },

  async removeSpotFromRegistration (userId) {
    let response = await Axios.post(`${apiBase}/registrations/user/${userId}/removespot`)

    return response.data
  },

  async deleteRegistration (userId) {
    let response = await Axios.post(`${apiBase}/registrations/user/${userId}/delete`)

    return response.data
  },

  async createOpRegs(regType, amount) {
    await Axios.post(`${apiBase}/create-batch-regs`, {regType: regType, amount: amount})
  }
}