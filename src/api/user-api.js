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

  async signup (userDataObject) {
    let response = await Axios.post(`${apiBase}/api/users`, userDataObject)

    return response.data
  },

  async refreshUserData () {
    let response = await Axios.get(`${apiBase}/api/user`)

    return response.data
  },

  async logout () {
    Axios.post(`${apiBase}/logout`)
  },

  async saveEditedUser (userId, userDataObject) {
    let response = await Axios.post(`${apiBase}/api/users/${userId}`, userDataObject)

    return response.data
  },

  async saveUserAsAdmin (userId, userDataObject) {
    let response = await Axios.post(`${apiBase}/api/users/${userId}/as-admin`, userDataObject)

    return response.data
  }
}