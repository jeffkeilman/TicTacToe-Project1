const config = require('../config')

const register = function (data) {
  console.log('hello from register')
}

const login = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/sign-in',
    method: 'POST',
    data
  })
}

module.exports = {
  register,
  login
}
