const api = require('./api')
const getFormFields = require('../../../lib/get-form-fields')
const ui = require('./ui')

const onLoginRegister = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)

  if ($('#isRegister').is(':checked')) {
    // register
    // api.register(data)
    //   .then(ui.registerSuccess)
    //   .catch(ui.registerFailure)
    console.log('Not ready yet')
  } else {
    // login
    // api.login(data)
    //   .then(ui.signOnSuccess)
    //   .catch(ui.signOnFailure)
    console.log('Not ready yet')
  }
}

const addEventHandlers = function () {
  // Adds focus support on modals for HTML5
  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
  })
  // Login/Register submit
  $('#loginRegisterForm').on('submit', onLoginRegister)
}

module.exports = {
  addEventHandlers,
  onLoginRegister
}
