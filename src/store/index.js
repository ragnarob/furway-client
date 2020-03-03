import Vue from 'vue'
import Vuex from 'vuex'

import userApi from '../api/user-api'
import registrationApi from '../api/registration-api';
import miscApi from '../api/misc-api';

import admin from './admin'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    admin,
  },

  state: {
    conInfo: {},
    isLoggedIn: false,
    userData: null,
    signupSuccess: false,
    myRegistration: null,
  },

  mutations: {
    setConInfo: (state, conInfo) => state.conInfo = conInfo,
    setIsLoggedIn: (state, isLoggedIn) => state.isLoggedIn = isLoggedIn,
    setUserData: (state, userData) => {
      state.userData = userData 
    },
    setSignupSuccess: (state, isSuccess) => state.signupSuccess = isSuccess,
    setMyRegistration: (state, registrationData) => state.myRegistration = registrationData,
  },

  actions: {
    async setUserData (context, userData) {
      if (userData) {
        context.commit('setIsLoggedIn', true)

        if (userData.dateOfBirth) {
          userData['dateOfBirth'] = new Date(userData['dateOfBirth'])
        }
        if (userData.pickupTime) {
          userData['pickupTime'] = new Date(userData['pickupTime'])
        }
      }
      else {
        context.commit('setIsLoggedIn', false)
      }

      context.commit('setUserData', userData)
    },

    async loadConInfo (context) {
      let response = await miscApi.getConInfo()

      if ('error' in response) { return }

      let tempDate = new Date(response.registrationOpenDate + 'Z')
      tempDate.setTime(tempDate.getTime() - 3600000)
      response.registrationOpenDate = tempDate.toISOString()

      context.commit('setConInfo', response)
    },

    async login (context, {usernameOrEmail, password}) {
      let response = await userApi.login(usernameOrEmail, password)
      if (!response.error) {
        context.dispatch('setUserData', response)
        return {success: true}
      }
      return {success: false, error: response.error}
    },

    async logout (context) {
      context.dispatch('setUserData', null)
    },

    async refreshUserData (context) {
      let response = await userApi.refreshUserData()
      context.dispatch('setUserData', response)

      let isLoggedIn = response && response['user'] !== null
      context.commit('setIsLoggedIn', isLoggedIn)

      context.dispatch('getMyRegistration')
    },

    async getMyRegistration (context) {
      if (!context.state.isLoggedIn) { return }

      let response = await registrationApi.getRegistrationById(context.state.userData.id)

      if ('error' in response) { return }
      context.commit('setMyRegistration', response)

      return response
    },

    logout (context) {
      context.dispatch('setUserData', null)
      context.commit('setMyRegistration', null)
    }
  },

  getters: {
    myRegistration: state => state.myRegistration,
    hasRegistration: state => state.isLoggedIn && state.userData.registrationId !== null && state.userData.registrationId !== undefined,
    conInfo: state => state.conInfo,
    isLoggedIn: state => state.isLoggedIn,
    userData: state => state.userData,
  }
})
