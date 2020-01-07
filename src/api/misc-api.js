import Axios from 'axios'

let apiBase = '/api'

export default {
  async getConInfo () {
    let response = await Axios.get(`${apiBase}/con-info`)

    return response.data
  },

  async updateConInfo (newConInfo) {
    let response = await Axios.post(`${apiBase}/con-info`, {conIfno: newConInfo})

    return response.data
  }
}