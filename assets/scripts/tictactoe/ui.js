'use strict'

const store = require('../store.js')

const signOnSuccess = function (data) {
  _clearLoginModal(true)
  _prepSelectionArea()

  store.user = data.user
}

const signOnFailure = function () {
  $('#displayFeedback').show()
  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Hmm... looks like we don\'t have an account with that email and password.<div>'
  )
  _clearLoginModal()
}

const registerSuccess = function () {
  $('#displayFeedback').show()
  $('#displayFeedback').html(
    '<div class="alert alert-success" role="alert">You are all set! Login to play!</div>'
  )
  _clearLoginModal(true)
}

const registerFailure = function () {
  $('#displayFeedback').show()
  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Hmm... looks like we might already have an account with this information.<div>'
  )
  _clearLoginModal(true)
}

const logoutSuccess = function () {
  _restoreMain()
  store.user = null
}

const logoutFailure = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">There is something wrong with the logout. Harass the developer!<div>'
  )
}

const changePassSuccess = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-success" role="alert">Password changed!</div>'
  )
  _clearChangePassModal()
}

const changePassFailure = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Password change failed!</div>'
  )
  _clearChangePassModal()
}

const newGameSuccess = function (data) {
  // TODO: build game and display
}

const newGameFailure = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">New game creation failed!</div>'
  )
}

const loadGames = function (data) {
  data.games.forEach((game) => {
    if (game.over === false) {
      $('#gameSelectionArea ul').append(
        '<li><a class="drop-down-items" href="#">' + game.id + '</a></li>'
      )
    }
  })
}

const loadFailure = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Failed to load your games!</div>'
  )
}

const _clearChangePassModal = function () {
  $('#changePassModal').modal('hide')
  $('#oldPassLabel').val('')
  $('#newPassLabel').val('')
}

const _clearLoginModal = function (all) {
  $('#loginRegisterModal').modal('hide')
  if (all) {
    $('#emailLabel').val('')
    $('#passwordLabel').val('')
    $('#passwordConfLabel').val('')
    $('#isRegister').prop('checked', false)
    $('#confirmPassword').hide()
  } else {
    $('#passwordLabel').val('')
    $('#isRegister').prop('checked', false)
    $('#confirmPassword').hide()
  }
}

const _prepSelectionArea = function () {
  $('#loginButton').hide()
  $('#displayFeedback').hide()
  $('#changePass').show()
  $('#logoutButton').show()
  $('#gameSelectionArea').show()
}

const _restoreMain = function () {
  $('#gameArea').hide()
  $('#logoutButton').hide()
  $('#changePass').hide()
  $('#displayFeedback').hide()
  $('#gameSelectionArea').hide()
  $('#pregame').show()
  $('#loginButton').show()
}

module.exports = {
  signOnSuccess,
  signOnFailure,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  logoutFailure,
  changePassSuccess,
  changePassFailure,
  newGameSuccess,
  newGameFailure,
  loadGames,
  loadFailure
}
