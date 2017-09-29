'use strict'

const api = require('./api')
const getFormFields = require('../../../lib/get-form-fields')
const ui = require('./ui')
const store = require('../store.js')

const _onLoginRegister = function (event) {
  // TODO: Add error handling
  event.preventDefault()
  let data = getFormFields(event.target)

  if ($('#isRegister').is(':checked')) {
    // register
    api.register(data)
      .then(ui.registerSuccess)
      .catch(ui.registerFailure)
  } else {
    // login, ensure data is cleaned of password_conf
    data = {
      credentials: {
        email: data.credentials.email,
        password: data.credentials.password
      }
    }
    api.login(data)
      .then(ui.signOnSuccess)
      .then(_loadGames)
      .catch(ui.signOnFailure)
  }
}

const _loadGames = function () {
  api.loadGames()
    .then(ui.loadGames)
    .catch(ui.loadGamesFailure)
}

const _loadGame = function () {
  const id = $('#selectGameSave').text()
  api.loadGame(id)
    .then(ui.displayGame)
    .catch(ui.loadGameFailure)
}

const _onLogout = function (event) {
  event.preventDefault()

  api.logout()
    .then(ui.logoutSuccess)
    .catch(ui.logoutFailure)
}

const _onChangePass = function (event) {
  // TODO: Add error handling
  event.preventDefault()
  const data = getFormFields(event.target)

  api.changePass(data)
    .then(ui.changePassSuccess)
    .catch(ui.changePassFailure)
}

const _onNewGame = function (event) {
  event.preventDefault()

  if (store.user.currentGame) {
    store.user.currentGame = null
  }

  api.newGame()
    .then(ui.displayGame)
    .catch(ui.newGameFailure)
}

const _showHidePassConf = function () {
  if ($('#isRegister').is(':checked')) {
    $('#confirmPassword').show()
  } else {
    $('#confirmPassword').hide()
  }
}

const _handleClickedCell = function (cell) {
  let over = false
  const givenIndex = Object.keys(ui.gameMap).find(key => ui.gameMap[key] === $(cell).prop('id'))
  let length = 0
  $(cell).prop('disabled', true)
  for (let x = 0; x < store.user.currentGame.cells.length; x++) {
    if (store.user.currentGame.cells[x]) {
      length++
    }
  }
  const xOrO = _whosTurn(length)
  store.user.currentGame.cells[givenIndex] = xOrO
  ui.markIt(cell)

  // check for win or draw
  if (_checkForWin()) {
    over = true
  } else if (length > 7) {
    ui.handleDraw()
    over = true
  }

  const data = {
    game: {
      cell: {
        index: givenIndex,
        value: xOrO
      },
      over: over
    }
  }

  api.updateGame(data)
    .catch(ui.updateFailure)

  if (over) {
    store.user.currentGame = null
  }
}

const _whosTurn = function (turns) {
  return turns % 2 === 0 ? 'X' : 'O'
}

const _checkForWin = function () {
  const game = store.user.currentGame.cells
  if (game[0] && game[3] && game[6]) {
    if (game[0] === game[3] && game[3] === game[6]) {
      ui.handleWin()
      return true
    }
  }
  if (game[1] && game[4] && game[7]) {
    if (game[1] === game[4] && game[4] === game[7]) {
      ui.handleWin()
      return true
    }
  }
  if (game[2] && game[5] && game[8]) {
    if (game[2] === game[5] && game[5] === game[8]) {
      ui.handleWin()
      return true
    }
  }
  if (game[0] && game[1] && game[2]) {
    if (game[0] === game[1] && game[1] === game[2]) {
      ui.handleWin()
      return true
    }
  }
  if (game[3] && game[4] && game[5]) {
    if (game[3] === game[4] && game[4] === game[5]) {
      ui.handleWin()
      return true
    }
  }
  if (game[6] && game[7] && game[8]) {
    if (game[6] === game[7] && game[7] === game[8]) {
      ui.handleWin()
      return true
    }
  }
  if (game[0] && game[4] && game[8]) {
    if (game[0] === game[4] && game[4] === game[8]) {
      ui.handleWin()
      return true
    }
  }
  if (game[2] && game[4] && game[6]) {
    if (game[2] === game[4] && game[4] === game[6]) {
      ui.handleWin()
      return true
    }
  }
  return false
}

const _goBack = function (event) {
  event.preventDefault()
  _loadGames()
  ui.goBack()
}

const _onClickHist = function (event) {
  event.preventDefault()
  api.loadFinishedGames()
    .then(ui.showFinishedGames)
    .catch(ui.loadFinishedGamesError)
}

const _onClickStats = function (event) {
  event.preventDefault()
  api.loadFinishedGames()
    .then(ui.showStats)
    .catch(ui.showStatsError)
}

const addEventHandlers = function () {
  // Adds focus support on modals for HTML5
  $('#loginRegisterModal').on('shown.bs.modal', function () {
    $('#emailLabel').focus()
  })
  $('#changePassModal').on('shown.bs.modal', function () {
    $('#oldPassLabel').focus()
  })
  $('#loginRegisterForm').on('submit', _onLoginRegister)
  $('#changePassForm').on('submit', _onChangePass)
  $('#logoutButton').on('click', _onLogout)
  // Show/Hide password conf
  $('#isRegister').on('change', _showHidePassConf)
  $('#newGameButton').on('click', _onNewGame)
  // Set drop down menu (a button) text value to ID of selected game
  $('#gameSelectionArea').on('click', '.drop-down-items', function (event) {
    $('#selectGameSave').html($(event.currentTarget).text() +
    ' <span class="caret" id="hack"></span>')
  })
  $('#submitSaveButton').on('click', _loadGame)
  $('#goBackButton').on('click', _goBack)
  $('#newGameInGameButton').on('click', _onNewGame)
  $('#historyButton').on('click', _onClickHist)
  $('#statsButton').on('click', _onClickStats)

  // All of the game buttons
  $('#gameArea').on('click', '#topLeft:enabled', function (event) {
    event.preventDefault()
    _handleClickedCell(this)
  })
  $('#gameArea').on('click', '#topMiddle:enabled', function (event) {
    event.preventDefault()
    _handleClickedCell(this)
  })
  $('#gameArea').on('click', '#topRight:enabled', function (event) {
    event.preventDefault()
    _handleClickedCell(this)
  })
  $('#gameArea').on('click', '#middleLeft:enabled', function (event) {
    event.preventDefault()
    _handleClickedCell(this)
  })
  $('#gameArea').on('click', '#middleMiddle:enabled', function (event) {
    event.preventDefault()
    _handleClickedCell(this)
  })
  $('#gameArea').on('click', '#middleRight:enabled', function (event) {
    event.preventDefault()
    _handleClickedCell(this)
  })
  $('#gameArea').on('click', '#bottomLeft:enabled', function (event) {
    event.preventDefault()
    _handleClickedCell(this)
  })
  $('#gameArea').on('click', '#bottomMiddle:enabled', function (event) {
    event.preventDefault()
    _handleClickedCell(this)
  })
  $('#gameArea').on('click', '#bottomRight:enabled', function (event) {
    event.preventDefault()
    _handleClickedCell(this)
  })
}

module.exports = {
  addEventHandlers
}
