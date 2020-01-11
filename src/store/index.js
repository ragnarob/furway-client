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
    setUserData: (state, userData) => state.userData = userData,
    setSignupSuccess: (state, isSuccess) => state.signupSuccess = isSuccess,
    setMyRegistration: (state, registrationData) => state.myRegistration = registrationData,
  },

  actions: {
    async loadConInfo (context) {
      let response = await miscApi.getConInfo()

      if ('error' in response) { return }

      context.commit('setConInfo', response)
    },

    async login (context, {usernameOrEmail, password}) {
      let response = await userApi.login(usernameOrEmail, password)
      if (!response.error) {
        context.commit('setUserData', response)
        context.commit('setIsLoggedIn', true)
        return {success: true}
      }
      return {success: false, error: response.error}
    },

    async logout (context) {
      context.commit('setIsLoggedIn', false)
      context.commit('setUserData', null)
    },

    async refreshUserData (context) {
      let response = await userApi.refreshUserData()
      context.commit('setUserData', response)

      context.dispatch('getMyRegistration')
    },

    async getMyRegistration (context) {
      if (!context.state.isLoggedIn) { return }

      let response = await registrationApi.getRegistrationById(context.state.userData.id)

      if ('error' in response) { return }
      context.commit('setMyRegistration', response)
    },

    logout (context) {
      context.commit('setIsLoggedIn', false)
      context.commit('setUserData', null)
      context.commit('setMyRegistration', null)
    }
  },

  getters: {
    myRegistration: (state) => state.myRegistration,
    conInfo: (state) => state.conInfo,
    isLoggedIn: state => state.isLoggedIn,
    userData: state => state.userData,
  }
})
