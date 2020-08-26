const mongoose = require('mongoose')
const User = require('../models/user.model')

module.exports.login = (req, res, next) => {
  res.json('users/login')
}
module.exports.doLogin = (req, res, next) => {
  res.json('users/doLogin')
}


module.exports.signup = (req, res, next) => {
  res.json('users/signup')
}
module.exports.doSignup = (req, res, next) => {
  res.json('users/doSignup')
}

module.exports.doLogout = (req, res, next) => {
  res.json('users/doLogout')
}

module.exports.viewProfile = (req, res, next) => {
  res.json('users/viewProfile')
}
module.exports.doEditProfile = (req, res, next) => {
  res.json('users/doEditProfile')
}