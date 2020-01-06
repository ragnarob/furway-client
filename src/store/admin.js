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
    async loadData ({commit}) {
      let [allRegistrations, pendingRegistrations, allUsers, waitingLists] = await Promise.all([
        registrationApi.getAllRegistrations(),
        registrationApi.getPendingRegistrations(),
        userApi.getAllUsers(),
        registrationApi.getWaitingLists()
      ]) 

      commit('setAllRegistrations', allRegistrations)
      commit('setPendingRegistrations', pendingRegistrations)
      commit('setAllUsers', allUsers)
      commit('setWaitingLists', waitingLists)
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

    isAllUsersOpen: state => state.isAllUsersOpen,
    highlightedUsername: state => state.highlightedUsername,
    isAllRegistrationsOpen: state => state.isAllRegistrationsOpen,
    highlightedRegistrationId: state => state.highlightedRegistrationId,

    highlightedUsernameFunc: state => () => state.highlightedUsername,
    highlightedRegistrationIdFunc: state => () => state.highlightedRegistrationId,
  },
}