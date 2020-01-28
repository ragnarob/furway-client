import Axios from 'axios'

let apiBase = '/api'

export default {
  async getDriverInfo () {
    let response = await Axios.get(`${apiBase}/driver-info`)

    return response.data
  },

  async getConInfo () {
    let response = await Axios.get(`${apiBase}/con-info`)

    return response.data
  },

  async updateConInfo (newConInfo) {
    let response = await Axios.post(`${apiBase}/con-info`, {conIfno: newConInfo})

    return response.data
  },

  async logRoute (route) {
    Axios.post(`${apiBase}/log-route`, {'route': route})
  },
}