const mongoose = require('mongoose')
const User = require('../models/user.model')

module.exports.login = (req, res, next) => {
  res.render('users/login')
}
