'use strict'

const api = require('./api')
const getFormFields = require('../../../lib/get-form-fields')
const ui = require('./ui')

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
    .catch(ui.loadFailure)
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

  api.newGame()
    .then(ui.newGameSuccess)
    .catch(ui.newGameFailure)
}

const _showHidePassConf = function () {
  if ($('#isRegister').is(':checked')) {
    $('#confirmPassword').show()
  } else {
    $('#confirmPassword').hide()
  }
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
}

module.exports = {
  addEventHandlers
}
