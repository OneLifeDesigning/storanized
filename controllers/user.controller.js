const mongoose = require('mongoose')
const User = require('../models/user.model')

module.exports.login = (req, res, next) => {
  res.render('users/login', { title: 'Login', error: false} )
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      res.render('users/login', {
        error: {
          email: {
            message: 'The email and password combination does not match, please try again.'
          }
        }
      })
    }
    user.checkPassword(req.body.password)
      .then(match => {
        if (match) {
          if (user.activation.active) {
            req.session.userId = user._id
            res.redirect('/profile')
          } else {
            res.render('users/login', {
              error: {
                validation: {
                  message: 'Your account is not active, check your email!.'
                }
              }
            })
          }
        } else {
          res.render('users/login', {
            error: {
              email: {
                message: 'The email and password combination does not match, please try again.'
              }
            }
          })
        }
      })
      .catch(next)
  })
  .catch(next)
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