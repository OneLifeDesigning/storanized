const mongoose = require('mongoose')
const mailer = require('../config/mailer.config');
const User = require('../models/user.model')

module.exports.login = (req, res, next) => {
  res.render('users/login', { title: 'Login'} )
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
  res.render('users/signup', { title: 'Signup'} )
}
module.exports.doSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if(!user) {
      const newUser = new User({
        ...req.body,
        avatar: req.file ? req.file.path : './img/default-avatar.png'
      });
    
      user.save()
        .then(user => {
          mailer.sendValidationEmail({
            name: user.name,
            email: user.email,
            id: user._id.toString(),
            activationToken: user.activation.token
          })
          
          res.render('users/login', {
            message: 'Check your email for activate account'
          })
        })
        .catch(error => {
          if (error instanceof mongoose.Error.ValidationError) {
            res.render('users/signup', { 
              user,
              error: error.errors
            })
          } else if (error.code === 11000) {
            mailer.sendDuplicateEmail({
              name: user.name,
              email: user.email,
              id: user._id.toString(),
              activationToken: user.activation.token
            })

            res.render('users/login', {
              message: 'Check your email for activate account'
            })
          } else {
            next(error);
          }
        })
        .catch(next)
    }
  })
  .catch(next)
}

module.exports.doLogout = (req, res, next) => {
    req.session.destroy()
  
    res.redirect('/')
}
 
module.exports.viewProfile = (req, res, next) => {
  res.json('users/viewProfile')
}
module.exports.doEditProfile = (req, res, next) => {
  res.json('users/doEditProfile')
}