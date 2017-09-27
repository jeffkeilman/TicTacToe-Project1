'use strict'

const api = require('./api')
const getFormFields = require('../../../lib/get-form-fields')
const ui = require('./ui')

const onLoginRegister = function (event) {
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

const addEventHandlers = function () {
  // Adds focus support on modals for HTML5
  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
  })
  // Login/Register submit
  $('#loginRegisterForm').on('submit', onLoginRegister)
  // Show/Hide password conf
  $('#isRegister').on('change', _showHidePassConf)
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
