const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const storageController = require('../controllers/storage.controller')
const sessionMiddleware = require('../middlewares/session.middleware')

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  })
})
 
router.get('/login', sessionMiddleware.isNotAuthenticated, userController.login)
router.post('/login', sessionMiddleware.isNotAuthenticated, userController.doLogin)

router.get('/signup', sessionMiddleware.isNotAuthenticated, userController.signup)
router.post('/signup', sessionMiddleware.isNotAuthenticated, userController.doSignup)

router.post('/logout', sessionMiddleware.isAuthenticated, userController.doLogout)

// Magiclink to validate token
router.get('/activate/:id/:token', sessionMiddleware.isNotAuthenticated, userController.doValidateToken)

router.get('/profile', sessionMiddleware.isAuthenticated, userController.viewProfile)
router.post('/profile', sessionMiddleware.isAuthenticated, userController.doEditProfile)

// Get - Form to change pass
router.get('/profile/password', sessionMiddleware.isAuthenticated, userController.editPassword)
router.post('/profile/password', sessionMiddleware.isAuthenticated, userController.doEditPassword)

// Get - Form to send new token 
router.get('/token', sessionMiddleware.isNotAuthenticated, userController.newToken)
router.post('/token', sessionMiddleware.isNotAuthenticated, userController.doNewToken)

// Get - Form to send new email to regenerate pass
router.get('/password', sessionMiddleware.isNotAuthenticated, userController.forgotPassword)
router.post('/password', sessionMiddleware.isNotAuthenticated, userController.doForgotPassword)

// Magiclink to access and change passs
router.get('/password/:id/:token', sessionMiddleware.isNotAuthenticated, userController.recoveryPassword)

router.get('/storages/all', sessionMiddleware.isAuthenticated, storageController.all)
router.get('/storages/new', sessionMiddleware.isAuthenticated, storageController.new)
router.post('/storages/new', sessionMiddleware.isAuthenticated, storageController.doNew)
router.get('/storages/show/:id', sessionMiddleware.isAuthenticated, storageController.show)
router.get('/storages/edit/:id', sessionMiddleware.isAuthenticated, storageController.viewEdit)
router.post('/storages/edit/', sessionMiddleware.isAuthenticated, storageController.update)
/* 
TODO:
  
  router.get('/auth/slack', userController.doAuthSlack)
  router.get('/auth/google', userController.doAuthGoogle)
  router.get('/auth/facebook', userController.doAuthFacebook)
  
 
*/


module.exports = router;