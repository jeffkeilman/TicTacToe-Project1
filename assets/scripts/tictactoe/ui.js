'use strict'

const gameMap = {
  0: 'topLeft',
  1: 'topMiddle',
  2: 'topRight',
  3: 'middleLeft',
  4: 'middleMiddle',
  5: 'middleRight',
  6: 'bottomLeft',
  7: 'bottomMiddle',
  8: 'bottomRight'
}

const store = require('../store.js')

const handleWin = function () {
  let length = 0

  for (const key in gameMap) {
    $('#' + gameMap[key]).prop('disabled', true)
  }

  for (let x = 0; x < store.user.currentGame.cells.length; x++) {
    if (store.user.currentGame.cells[x]) {
      length++
    }
  }

  $('#turnDisplay').text(_whosTurn(length + 1) + ' wins!')
}

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

const newGameFailure = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">New game creation failed!</div>'
  )
}

const loadGames = function (data) {
  data.games.forEach((game) => {
    $('#gameSelectionArea ul').append(
      '<li><a class="drop-down-items" href="#">' + game.id + '</a></li>'
    )
  })
}

const loadGamesFailure = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Failed to load your games!</div>'
  )
}

const displayGame = function (data) {
  const game = data.game['cells']
  let turns = 0
  for (let x = 0; x < game.length; x++) {
    if (game[x]) {
      $('#' + gameMap[x]).text(game[x])
      $('#' + gameMap[x]).prop('disabled', true)
      turns++
    }
  }

  store.user.currentGame = {
    id: data.game['id'],
    cells: data.game['cells']
  }

  _setTurnMessage(turns)

  $('#pregame').hide()
  $('#gameSelectionArea').hide()
  $('#gameArea').show()
}

const loadGameFailure = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Failed to load your game!</div>'
  )
}

const markIt = function (cell) {
  let length = 0
  for (let x = 0; x < store.user.currentGame.cells.length; x++) {
    if (store.user.currentGame.cells[x]) {
      length++
    }
  }
  _setTurnMessage(length)
  $(cell).text(_whosTurn(length + 1))
}

const _setTurnMessage = function (turns) {
  $('#playerName').text(_whosTurn(turns))
}

const _whosTurn = function (turns) {
  return turns % 2 === 0 ? 'X' : 'O'
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
  newGameFailure,
  loadGames,
  loadGamesFailure,
  displayGame,
  loadGameFailure,
  markIt,
  gameMap,
  handleWin
}
