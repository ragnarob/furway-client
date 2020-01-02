import Axios from 'axios'

let apiBase = '/api'

export default {
  async getConInfo () {
    let response = await Axios.get(`${apiBase}/con-info`)

    return response.data
  },
}