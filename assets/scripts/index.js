'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
const events = require('./tictactoe/events')

$(() => {
  setAPIOrigin(location, config)
  events.addEventHandlers()
  // default state
  $('#confirmPassword').hide()
  $('#gameArea').hide()
  $('#logoutButton').hide()
  $('#changePass').hide()
  $('#gameSelectionArea').hide()
  $('#histStatsRow').hide()
  $('#passError').hide()
})
