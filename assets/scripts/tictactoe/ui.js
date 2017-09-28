'use strict'

const store = require('../store.js')

const signOnSuccess = function (data) {
  _clearModal(true)
  _prepGameArea()

  store.user = data.user
}

const signOnFailure = function () {
  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Hmm... looks like we don\'t have an account with that email and password.<div>'
  )
  _clearModal()
}

const registerSuccess = function (data) {
  $('#displayFeedback').html(
    '<div class="alert alert-success" role="alert">You are all set! Login to play!</div>'
  )
  _clearModal(true)
}

const registerFailure = function (data) {
  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Hmm... looks like we might already have an account with this information.<div>'
  )
  _clearModal(true)
}

const _clearModal = function (all) {
  $('#myModal').modal('hide')
  if (all) {
    $('#emailLabel').val('')
    $('#passwordLabel').val('')
    $('#passwordConfLabel').val('')
    $('#isRegister').prop('checked', false)
  } else {
    $('#passwordLabel').val('')
    $('#isRegister').prop('checked', false)
  }
}

const _prepGameArea = function () {
  $('#pregame').hide()
  $('#loginButton').hide()
  $('#gameArea').show()
}

module.exports = {
  signOnSuccess,
  signOnFailure,
  registerSuccess,
  registerFailure
}
