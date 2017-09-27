'use strict'
const store = require('../store.js')

const signOnSuccess = function (data) {
  _clearModal(true)
  // TODO: Display game

  store.user = data.user
}

const signOnFailure = function (error) {
  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Hmm... looks like we don\'t have an account with that email and password.<div>'
  )
  _clearModal()
  console.log(error)
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
  } else {
    $('#passwordLabel').val('')
  }
}

module.exports = {
  signOnSuccess,
  signOnFailure,
  registerSuccess,
  registerFailure
}
