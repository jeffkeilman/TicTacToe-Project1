'use strict'

const api = require('./api')
const getFormFields = require('../../../lib/get-form-fields')
const ui = require('./ui')

const onLoginRegister = function (event) {
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
      .catch(ui.signOnFailure)
  }
}

const onLogout = function (event) {
  event.preventDefault()

  api.logout()
    .then(ui.logoutSuccess)
    .catch(ui.logoutFailure)
}

const onChangePass = function (event) {
  // TODO: Add error handling
  event.preventDefault()
  const data = getFormFields(event.target)

  api.changePass(data)
    .then(ui.changePassSuccess)
    .catch(ui.changePassFailure)
}

const addEventHandlers = function () {
  // Adds focus support on modals for HTML5
  $('#loginRegisterModal').on('shown.bs.modal', function () {
    $('#emailLabel').focus()
  })
  $('#changePassModal').on('shown.bs.modal', function () {
    $('#oldPassLabel').focus()
  })
  $('#loginRegisterForm').on('submit', onLoginRegister)
  $('#changePassForm').on('submit', onChangePass)
  $('#logoutButton').on('click', onLogout)
  // Show/Hide password conf
  $('#isRegister').on('change', _showHidePassConf)
  $('.drop-down-items').click(function (event) {
    $('#selectGameSave').html($(event.currentTarget).text() +
    ' <span class="caret" id="hack"></span>')
  })
}

const _showHidePassConf = function () {
  if ($('#isRegister').is(':checked')) {
    $('#confirmPassword').show()
  } else {
    $('#confirmPassword').hide()
  }
}
module.exports = {
  addEventHandlers,
  onLoginRegister
}
