const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const storageController = require('../controllers/storage.controller')
const addressController = require('../controllers/address.controller')
const sessionMiddleware = require('../middlewares/session.middleware')
const Box = require('../models/box.model')
const boxController = require('../controllers/box.controller')

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

router.get('/storages', sessionMiddleware.isAuthenticated, storageController.all)
router.get('/storages/new', sessionMiddleware.isAuthenticated, storageController.new)
router.post('/storages/new', sessionMiddleware.isAuthenticated, storageController.doNew)
router.get('/storages/:id', sessionMiddleware.isAuthenticated, storageController.show)
router.get('/storages/:id/edit', sessionMiddleware.isAuthenticated, storageController.edit)
router.post('/storages/:id/edit', sessionMiddleware.isAuthenticated, storageController.doEdit)
// router.post('/storages/:id/delete', sessionMiddleware.isAuthenticated, storageController.delete)

router.get('/addresses', sessionMiddleware.isAuthenticated, addressController.all)
router.get('/addresses/new', sessionMiddleware.isAuthenticated, addressController.new)
router.post('/addresses/new', sessionMiddleware.isAuthenticated, addressController.doNew)
router.get('/addresses/:id', sessionMiddleware.isAuthenticated, addressController.show)
router.get('/addresses/:id/edit', sessionMiddleware.isAuthenticated, addressController.edit)
router.post('/addresses/:id/edit', sessionMiddleware.isAuthenticated, addressController.doEdit)
router.post('/addresses/:id/delete', sessionMiddleware.isAuthenticated, addressController.delete)

//Get- view all boxes
router.get('/boxes', sessionMiddleware.isAuthenticated, boxController.all)

/* 
TODO:
  
  router.get('/auth/slack', userController.doAuthSlack)
  router.get('/auth/google', userController.doAuthGoogle)
  router.get('/auth/facebook', userController.doAuthFacebook)
  
 
*/


module.exports = router;