import Axios from 'axios'

let apiBase = ''

export default {
  async login (usernameOrEmail, password) {
    let response = await Axios.post(`${apiBase}/login`, {usernameOrEmail: usernameOrEmail, password: password})

    return response.data
  },

  async getAllUsers () {
    let response = await Axios.get(`${apiBase}/api/users`)

    return response.data
  },

  async signup (userInfoObject) {
    let response = await Axios.post(`${apiBase}/api/users`, userInfoObject)

    return response.data
  },

  async refreshUserData () {
    let response = await Axios.get(`${apiBase}/api/user`)

    return response.data
  },

  async logout () {
    Axios.post(`${apiBase}/logout`)
  }
}