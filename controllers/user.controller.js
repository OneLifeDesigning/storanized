const mongoose = require('mongoose')
const mailer = require('../config/mailer.config');
const User = require('../models/user.model')

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

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
        role: 'client',
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

module.exports.doValidateToken = (req, res, next) => {
  User.findOne({ _id: req.params.id, "activation.token": req.params.token })
    .then(user => {
      if (!user) {
        res.render('users/login', {
          error: {
            activation: {
              message: 'Something has gone wrong, click the button to generate a new activation code'
            }
          }
        })
      } 
      user.activation.active = true;

      user.save()
        .then(user => {
          res.render('users/login', {
            message: 'Your account has been activated, login below!'
          })
        })
        .catch(next)
    })
    .catch(next)
}

module.exports.newToken = (req, res, next) => {
  res.render('users/newtoken', { title: 'Get new token'} )
}

module.exports.doNewToken = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user || user.activation.active === true) {
        res.render('users/login', {
          error: {
            activation: {
              message: 'Something has gone wrong, click the button to generate a new activation code, or enter your credentials again'
            }
          }
        })
      }
      user.activation.oldToken = user.activation.token;
      user.activation.token = generateRandomToken()
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
        .catch(next)
    })
    .catch(next)
}

module.exports.viewProfile = (req, res, next) => {
  res.json('users/viewProfile')
}
module.exports.doEditProfile = (req, res, next) => {
  res.json('users/doEditProfile')
}