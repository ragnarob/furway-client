import registrationApi from "../api/registration-api";
import userApi from "../api/user-api";

export default {
  state: {
    allUsers: [],
    allRegistrations: [],
    pendingRegistrations: [],
    waitingLists: {'inside': [], 'outside': []},
    timestampFormat: 'short',

    isAllUsersOpen: false,
    highlightedUsername: null,
    isAllRegistrationsOpen: false,
    highlightedRegistrationId: null,
  },

  mutations: {
    setAllUsers (state, allUsers) { state.allUsers = allUsers },
    setAllRegistrations (state, allRegistrations) { state.allRegistrations = allRegistrations },
    setPendingRegistrations (state, pendingRegistrations) { state.pendingRegistrations = pendingRegistrations },
    setWaitingLists (state, waitingLists) { state.waitingLists = waitingLists },
    setTimestampFormat (state, timestampFormat) { state.timestampFormat = timestampFormat },

    setIsAllUsersOpen (state, isOpen) { state.isAllUsersOpen = isOpen },
    setHighlightedUsername (state, username) { state.highlightedUsername = username },
    setIsAllRegistrationsOpen (state, isOpen) { state.isAllRegistrationsOpen = isOpen },
    setHighlightedRegistrationId (state, id) { state.highlightedRegistrationId = id },
  },

  actions: {
    async loadAllAdminData ({rootState, commit}) {
      let [allRegistrations, pendingRegistrations, allUsers, waitingLists] = await Promise.all([
        registrationApi.getAllRegistrations(),
        registrationApi.getPendingRegistrations(),
        userApi.getAllUsers(),
        registrationApi.getWaitingLists()
      ])

      for (let user of allUsers) {
        if (user.dateOfBirth) {
          user['dateOfBirth'] = new Date(user['dateOfBirth'])
        }
        if (user.pickupTime) {
          user['pickupTime'] = new Date(user['pickupTime'])
        }
      }

      commit('setAllRegistrations', allRegistrations)
      commit('setPendingRegistrations', pendingRegistrations)
      commit('setAllUsers', allUsers)
      commit('setWaitingLists', waitingLists)
    },

    toggleIsAllUsersOpen ({state, commit}) {
      commit('setIsAllUsersOpen', !state.isAllUsersOpen)
    },

    toggleIsAllRegistrationsOpen ({state, commit}) {
      commit('setIsAllRegistrationsOpen', !state.isAllRegistrationsOpen)
    },

    toggleTimestampFormat ({state, commit}) {
      commit('setTimestampFormat', state.timestampFormat === 'long' ? 'short' : 'long')
    },
  },

  getters: {
    allUsers: state => state.allUsers,
    allRegistrations: state => state.allRegistrations,
    pendingRegistrations: state => state.pendingRegistrations,
    waitingLists: state => state.waitingLists,
    timestampFormat: state => state.timestampFormat,
    usernamesWithReceivedRooms: state => state.allRegistrations
      .filter(reg => reg.receivedInsideSpot || reg.receivedOutsideSpot)
      .map(reg => reg.username),
    registrationsWithSpots: state => state.allRegistrations.filter(reg => reg.receivedInsideSpot || reg.receivedOutsideSpot),
    hasRegistration: state => state.isLoggedIn && state.userData.registrationId !== null && state.userData.registrationId !== undefined,

    isAllUsersOpen: state => state.isAllUsersOpen,
    highlightedUsername: state => state.highlightedUsername,
    isAllRegistrationsOpen: state => state.isAllRegistrationsOpen,
    highlightedRegistrationId: state => state.highlightedRegistrationId,

    highlightedUsernameFunc: state => () => state.highlightedUsername,
    highlightedRegistrationIdFunc: state => () => state.highlightedRegistrationId,
  },
}