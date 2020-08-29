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

module.exports.login = (req, res) => {
  res.render('users/login', { title: 'Login'} )
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      res.render('users/login', {
        title: 'Login',
        error: {
          validation: {
            message: 'The email and password combination does not match, please try again.'
          } 
        }
      })
    } else {
      user.checkPassword(req.body.password)
        .then(match => {
          if (match) {
            if (user.activation.active) {
              req.session.userId = user._id
              res.redirect('/profile')
            } else {
              res.render('users/login', {
                title: 'Login',
                error: {
                  validation: {
                    message: 'Your account is not active, check your email!.'
                  }
                }
              })
            }
          } else {
            res.render('users/login', {
              title: 'Login',
              error: {
                validation: {
                  message: 'The email and password combination does not match, please try again.'
                } 
              }
            })
          }
        })
        .catch(next)
      }
    })
    .catch(next)
}

module.exports.signup = (req, res, next) => {
  // TODO: Errase for producction 
  const user = {
    email: process.env.USER_DEFAULT_EMAIL || 'helo@you.com',
    password: process.env.USER_DEFAULT_PASSWORD || '12345678',
    username: process.env.USER_DEFAULT_USERNAME || 'hell0',
    name: process.env.USER_DEFAULT_NAME || 'Hess',
    lastname: process.env.USER_DEFAULT_LASTNAME || 'loll'   
  }
  res.render('users/signup', { title: 'Signup', user: user } )
}

module.exports.doSignup = (req, res, next) => {
    const user = new User({
      ...req.body,
      role: 'client',
      avatar: './img/default-avatar.png'
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
          title: 'Login',
          success: {
            message: 'Check your email for activate account.'
          }
        })
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.render('users/signup', { 
            title: 'Signup',
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
            title: 'Signup',            
            success: {
              message: 'Check your email for activate account.'
            }
          })
        } else {
          next(error);
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
          title: 'Login',
          error: {
            activation: {
              message: 'Something has gone wrong, click the button to generate a new activation code'
            }
          }
        })
      } else {
        user.activation.active = true;
  
        user.save()
          .then(user => {
            res.render('users/login', {
              title: 'Login',              
              success: {
                message: 'Your account has been activated, login below!'
              }
            })
          })
          .catch(next)
      }
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
          title: 'Login',          
          error: {
            activation: {
              message: 'Something has gone wrong, click the button to generate a new activation code, or enter your credentials again'
            }
          }
        })
      } else {
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
              success: {
                message: 'Check your email for activate account'
              }
            })
          })
          .catch(next)
      }
    })
    .catch(next)
}

module.exports.viewProfile = (req, res, next) => {
  User.findById(req.currentUser.id)
  .then(user => {
    res.render('users/profile', { user })
  })
  .catch(next)
}
module.exports.doEditProfile = (req, res, next) => {
  const body = req.body

  if (req.file) {
    body.avatar = req.file.path
  }

  User.findByIdAndUpdate(req.currentUser.id, body, { runValidators: true, new: true })
    .then(user => {
      if (!user) {
        res.redirect('/profile')
        next()
      } else {
        res.render('users/profile', { user, message: 'Your profile has been updated'})
      }
    })
    .catch(next)
}

module.exports.forgotPassword = (req, res, next) => {
  res.render('users/password')
}

module.exports.doForgotPassword = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.render('users/password', {
          error: {
            validation: {
              message: 'Something has gone wrong, please enter your email try again'
            }
          }
        })
      } else {
        mailer.sendrecoverPassword({
          name: user.name,
          email: user.email,
          id: user._id.toString(),
          activationToken: user.activation.token
        })
        
        res.render('users/password', {
            message: 'Check your email for reset password'
        })
      }

    })
    .catch(next)
}

module.exports.recoveryPassword = (req, res, next) => {
  User.findOne({ _id: req.params.id, "activation.token": req.params.token })
    .then(user => {
      if (!user) {
        res.render('users/password', {
          error: {
            validation: {
              message: 'Something has gone wrong, please enter your email try again'
            }
          }
        })
      } else {
        req.session.userId = user._id
        res.redirect('/profile/password')
      }
    })
    .catch(next)
}

module.exports.editPassword = (req, res, next) => {
  res.render('users/changepassword', {
    title: 'Change Password'
  })
}

module.exports.doEditPassword = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        res.render('users/changepassword', {
          title: 'Change Password',
          errors: {
            validation: {
              message: 'Something has gone wrong, please try again'
            }
          }
        })
      } else {
        if (req.body.password.length === 0 || req.body.passwordValidate.length === 0 || req.body.password !== req.body.passwordValidate) {
          res.render('users/recovery', {
            title: 'Change password',
            success: false,
            user,
            errors: {
              validation: {
                message: 'The passwords not match!, try again'
              }
            }
          })
        } else {
          user.password = req.body.password
          user.save()
            .then(user => {
              res.render('users/profile', {
                title: 'Profile', 
                success: 'Change password are success'
              })
            })
            .catch(next)
        }
      }
    })
    .catch(next)
}

