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

  _lockBoard()

  for (let x = 0; x < store.user.currentGame.cells.length; x++) {
    if (store.user.currentGame.cells[x]) {
      length++
    }
  }

  $('#turnDisplay').text(_whosTurn(length + 1) + ' wins!')
}

const passwordMismatch = function () {
  $('#passError').show().delay(5000).fadeOut()
}

const handleDraw = function () {
  $('#turnDisplay').text('Draw!')
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
  $('#gameSelectionArea ul').empty()
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
  $('#histStatsRow').hide()
  const game = data.game['cells']
  // clean game screen
  for (let x = 0; x < game.length; x++) {
    $('#' + gameMap[x]).text('')
    $('#' + gameMap[x]).prop('disabled', false)
  }
  $('#turnDisplay').html('Hey <span id="playerName"></span>, it\'s your turn!')

  let turns = 0
  // $('#topLeft').prop('disabled', false)
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
  $('#gameID').text(store.user.currentGame.id)

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

const updateFailure = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Unable to save your game!</div>'
  )
}

const goBack = function () {
  store.user.currentGame = null
  _resetSaveGameMessage()
  $('#gameArea').hide()
  $('#pregame').show()
  $('#gameSelectionArea').show()
}

const showFinishedGames = function (data) {
  $('#histStatsRow ol').empty()
  const games = data.games

  // build games list
  const gamesLists = _winningLosingLists(games)

  for (let x = 0; x < gamesLists.winners.length; x++) {
    $('#histStatsRow ol').append('<li>' + gamesLists.winners[x].id + ': WIN!</li>')
  }

  for (let x = 0; x < gamesLists.losers.length; x++) {
    $('#histStatsRow ol').append('<li>' + gamesLists.winners[x].id + ': LOSS!</li>')
  }

  $('#histStatsRow').show()
}

const showStats = function (data) {
  $('#histStatsRow ol').empty()
  const games = data.games

  // build games list
  const gamesLists = _winningLosingLists(games)

  $('#histStatsRow ol').append('<li>Wins: ' + gamesLists.winners.length + ' Losses: ' + gamesLists.losers.length + '</li>')
  $('#histStatsRow').show()
}

const showStatsError = function (data) {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Unable to load stats!</div>'
  )
}

const loadFinishedGamesError = function () {
  $('#displayFeedback').show()

  $('#displayFeedback').html(
    '<div class="alert alert-danger" role="alert">Unable to load game history!</div>'
  )
}

const _lockBoard = function () {
  for (const key in gameMap) {
    $('#' + gameMap[key]).prop('disabled', true)
  }
}

const _winningLosingLists = function (games) {
  const winningList = []
  const losingList = []
  for (let x = 0; x < games.length; x++) {
    const winner = _checkForWinner(games[x].cells)
    const playerExists = games[x]['player_' + winner.toLowerCase()]

    if (playerExists) {
      if (games[x]['player_' + winner.toLowerCase()].id === store.user.id) {
        winningList.push(games[x])
      } else {
        losingList.push(games[x])
      }
    } else {
      losingList.push(games[x])
    }
  }

  return {
    winners: winningList,
    losers: losingList
  }
}

const _checkForWinner = function (game) {
  if (game[0] && game[3] && game[6]) {
    if (game[0] === game[3] && game[3] === game[6]) {
      return game[0]
    }
  }
  if (game[1] && game[4] && game[7]) {
    if (game[1] === game[4] && game[4] === game[7]) {
      return game[1]
    }
  }
  if (game[2] && game[5] && game[8]) {
    if (game[2] === game[5] && game[5] === game[8]) {
      return game[2]
    }
  }
  if (game[0] && game[1] && game[2]) {
    if (game[0] === game[1] && game[1] === game[2]) {
      return game[0]
    }
  }
  if (game[3] && game[4] && game[5]) {
    if (game[3] === game[4] && game[4] === game[5]) {
      return game[3]
    }
  }
  if (game[6] && game[7] && game[8]) {
    if (game[6] === game[7] && game[7] === game[8]) {
      return game[6]
    }
  }
  if (game[0] && game[4] && game[8]) {
    if (game[0] === game[4] && game[4] === game[8]) {
      return game[0]
    }
  }
  if (game[2] && game[4] && game[6]) {
    if (game[2] === game[4] && game[4] === game[6]) {
      return game[2]
    }
  }
  return false
}

const _resetSaveGameMessage = function () {
  $('#selectGameSave').html('Saved Games <span class="caret" id="hack"></span>')
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
  _resetSaveGameMessage()
  $('#histStatsRow').hide()
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
  handleWin,
  updateFailure,
  goBack,
  showFinishedGames,
  loadFinishedGamesError,
  showStats,
  showStatsError,
  handleDraw,
  passwordMismatch
}
