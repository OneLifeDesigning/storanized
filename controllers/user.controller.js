const mongoose = require('mongoose')
const mailer = require('../config/mailer.config');
const User = require('../models/user.model')

// TODO: Errase for producction 
const userDemo = {
  email: process.env.USER_DEFAULT_EMAIL || 'helo@you.com',
  password: process.env.USER_DEFAULT_PASSWORD || '12345678',
  username: process.env.USER_DEFAULT_USERNAME || 'hell0',
  name: process.env.USER_DEFAULT_NAME || 'Hess',
  lastname: process.env.USER_DEFAULT_LASTNAME || 'loll'   
}

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

module.exports.login = (req, res) => {
  res.render('users/login', { title: 'Login', user: userDemo} )
}

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      const user = {}
      user.email = req.body.email
      res.render('users/login', {
        title: 'Login',
        user,
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
              res.redirect('/dashboard')
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
              user,
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
  res.render('users/signup', { title: 'Signup', user: userDemo } )
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
          console.log(error.errors);
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
              message: 'Something has gone wrong, click the button to generate a new activation code.'
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
        res.render('users/newtoken', {
          title: 'Get new token',          
          error: {
            activation: {
              message: 'Something has gone wrong, enter again your email, please'
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
            
            res.render('users/newtoken', { 
              title: 'Get new token',
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

module.exports.viewDashboard = (req, res, next) => {
  res.render('users/dashboard', { user: req.currentUser })
}

module.exports.doEditDashboard = (req, res, next) => {
  const body = req.body
  const user = req.currentUser
  
  if (req.file) {
    body.avatar = req.file.path
  }
  
  body.role = 'client'
  
  user.set(body)
  user.save()
    .then(user => {
      if (!user) {
        res.redirect('/dashboard')
      } else {
        res.redirect('/dashboard')
      }
    })
    .catch((error, user )=> {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('users/dashboard', { 
          user,
          error: error.errors
        })
      }
    })
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

        res.redirect('/')
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
        res.redirect('/dashboard/password')
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
  User.findById(req.currentUser._id.toString())
    .then(user => {
      if (!user) {
        res.render('users/changepassword', {
          title: 'Change Password',
          error: {
            validation: {
              message: 'Something has gone wrong, please try again'
            }
          }
        })
      } else {
        if (req.body.password !== req.body.passwordValidate) {
          res.render('users/changepassword', {
            title: 'Change password',
            error: {
              validation: {
                message: 'Passwords not match!, try again'
              }
            }
          })
        } else if (req.body.password.length <= 8) {
          res.render('users/changepassword', {
            title: 'Change password',
            error: {
              validation: {
                message: 'Password is too short, min 8 characters'
              }
            }
          })
        } else {
          user.password = req.body.password
          user.save()
            .then(() => {
              res.redirect('/dashboard')
            })
            .catch(next)
          }
        }
      })
    .catch(next)
}

