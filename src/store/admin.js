import registrationApi from "../api/registration-api";
import userApi from "../api/user-api";

export default {
  state: {
    allUsers: [],
    allRegistrations: [],
    waitingLists: {'inside': [], 'outside': []},
    timestampFormat: 'short',
    highlightedRegistrationId: null,
    highlightedUsername: null,
  },

  mutations: {
    setAllUsers (state, allUsers) { state.allUsers = allUsers },
    setAllRegistrations (state, allRegistrations) { state.allRegistrations = allRegistrations },
    setWaitingLists (state, waitingLists) { state.waitingLists = waitingLists },
    setTimestampFormat (state, timestampFormat) { state.timestampFormat = timestampFormat },
    setHighlightedRegistrationId (state, id) { state.highlightedRegistrationId = id },
    setHighlightedUsername (state, username) { state.highlightedUsername = username },
  },

  actions: {
    async loadData ({commit}) {
      let [allRegistrations, allUsers, waitingLists] = await Promise.all([
        registrationApi.getAllRegistrations(),
        userApi.getAllUsers(),
        registrationApi.getWaitingLists()
      ]) 

      commit('setAllRegistrations', allRegistrations)
      commit('setAllUsers', allUsers)
      commit('setWaitingLists', waitingLists)
    }
  },

  getters: {
    allUsers: state => state.allUsers,
    allRegistrations: state => state.allRegistrations,
    waitingLists: state => state.waitingLists,
    timestampFormat: state => state.timestampFormat,
    usernamesWithReceivedRooms: state => state.allRegistrations
      .filter(reg => reg.receivedInsideSpot || reg.receivedOutsideSpot)
      .map(reg => reg.username),
    highlightedRegistrationId: state => state.highlightedRegistrationId,
    highlightedUsername: state => state.highlightedUsername,

    highlightedRegistrationIdFunc: state => () => state.highlightedRegistrationId,
    highlightedUsernameFunc: state => () => state.highlightedUsername,
  },
}