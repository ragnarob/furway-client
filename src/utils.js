const utils = module.exports = {
  formatTimestamp (timestamp, timestampFormat) {
    return timestampFormat === 'short' ? utils.formatShortTimestamp(timestamp) : utils.formatLongTimestamp(timestamp)
  },

  formatShortTimestamp (timestamp) {
    return new Date(timestamp).toDateString().substr(4,6)
  },

  formatLongTimestamp (timestamp) {
    let tsDate = new Date(timestamp)
    return tsDate.toDateString().substr(4,6) + ', ' + tsDate.toTimeString().substr(0,8)
  },

  formatRoomPreference (roomPreference) {
    if (roomPreference === 'insideonly') { return 'Inside only' }
    else if (roomPreference === 'outsideonly') { return 'Outside only' }
    else { return 'Inside preference' }
  },

  sleepMillisec (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}