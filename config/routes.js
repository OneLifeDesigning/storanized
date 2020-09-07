const express = require('express')
const router = express.Router()
const sessionMiddleware = require('../middlewares/session.middleware')
const userController = require('../controllers/user.controller')
const storageController = require('../controllers/storage.controller')
const addressController = require('../controllers/address.controller')
const apiController = require('../controllers/api.controller')
const boxController = require('../controllers/box.controller')
const productsController = require('../controllers/product.controller')
const uploads = require('../config/multer.config')


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

router.get('/dashboard', sessionMiddleware.isAuthenticated, userController.viewDashboard)
router.post('/dashboard', sessionMiddleware.isAuthenticated, uploads.single(), userController.doEditDashboard)

// Get - Form to change pass
router.get('/dashboard/password', sessionMiddleware.isAuthenticated, userController.editPassword)
router.post('/dashboard/password', sessionMiddleware.isAuthenticated, userController.doEditPassword)

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

router.get('/addresses', sessionMiddleware.isAuthenticated, addressController.all)
router.get('/addresses/new', sessionMiddleware.isAuthenticated, addressController.new)
router.post('/addresses/new', sessionMiddleware.isAuthenticated, addressController.doNew)
router.get('/addresses/:id', sessionMiddleware.isAuthenticated, addressController.show)
router.get('/addresses/:id/edit', sessionMiddleware.isAuthenticated, addressController.edit)
router.post('/addresses/:id/edit', sessionMiddleware.isAuthenticated, addressController.doEdit)
router.post('/addresses/:id/delete', sessionMiddleware.isAuthenticated, addressController.delete)

//Get- view all boxes
router.get('/boxes', sessionMiddleware.isAuthenticated, boxController.all)
router.get('/boxes/new', sessionMiddleware.isAuthenticated, boxController.newBox)
router.post('/boxes/new', sessionMiddleware.isAuthenticated, boxController.create)
router.get('/boxes/:id', sessionMiddleware.isAuthenticated, boxController.view)
router.get('/boxes/:id/edit', sessionMiddleware.isAuthenticated, boxController.viewEdit)
router.post('/boxes/:id/edit', sessionMiddleware.isAuthenticated, boxController.update)
router.post('/boxes/:id/delete', sessionMiddleware.isAuthenticated, boxController.delete)

//Get- view all products
router.get('/products', sessionMiddleware.isAuthenticated, productsController.all)
router.get('/products/new', sessionMiddleware.isAuthenticated, productsController.new)
router.post('/products/new', sessionMiddleware.isAuthenticated, uploads.any(), productsController.create)
router.get('/products/:id', sessionMiddleware.isAuthenticated, productsController.view)
router.get('/products/:id/edit', sessionMiddleware.isAuthenticated, productsController.viewEdit)
router.post('/products/:id/edit', sessionMiddleware.isAuthenticated, productsController.update)
router.post('/products/:id/delete', sessionMiddleware.isAuthenticated, productsController.delete)

// API ENDPOINTS
router.post('/api/addresses/new', sessionMiddleware.isAuthenticated, apiController.doNewAddress)
router.post('/api/storages/boxes', sessionMiddleware.isAuthenticated, apiController.getBoxesInStorage)
/* 
TODO:
  
  router.get('/auth/slack', userController.doAuthSlack)
  router.get('/auth/google', userController.doAuthGoogle)
  router.get('/auth/facebook', userController.doAuthFacebook)
  
 
*/


module.exports = router;