'use strict'
const store = require('../store.js')

const signOnSuccess = function (data) {
  // TODO: Display game

  store.user = data.user
}

const signOnFailure = function () {
  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Hmm... looks like we don\'t have an account with that email and password.<div>'
  )
  $('#myModal').modal('hide')
  $('#passwordLabel').val('')
}

module.exports = {
  signOnSuccess,
  signOnFailure
}
