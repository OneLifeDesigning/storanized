const express = require('express')
const router = express.Router()
const sessionMiddleware = require('../middlewares/session.middleware')
const userController = require('../controllers/user.controller')
const storageController = require('../controllers/storage.controller')
const addressController = require('../controllers/address.controller')
const boxController = require('../controllers/box.controller')
const junglesales = require('../controllers/jungle.controller')
const productController = require('../controllers/product.controller')
const chatController = require('../controllers/chat.controller')
const uploads = require('../config/multer.config')

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    user: req.currentUser
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
router.post('/dashboard', sessionMiddleware.isAuthenticated, uploads.any(), userController.doEditDashboard)

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

//CRUD boxes
router.get('/boxes', sessionMiddleware.isAuthenticated, boxController.all)
router.get('/boxes/new', sessionMiddleware.isAuthenticated, boxController.newBox)
router.post('/boxes/new', sessionMiddleware.isAuthenticated, boxController.create)
router.get('/boxes/:id', sessionMiddleware.isAuthenticated, boxController.view)
router.get('/boxes/:id/edit', sessionMiddleware.isAuthenticated, boxController.viewEdit)
router.post('/boxes/:id/edit', sessionMiddleware.isAuthenticated, boxController.update)
router.post('/boxes/:id/delete', sessionMiddleware.isAuthenticated, boxController.delete)

//CRUD products
router.get('/products', sessionMiddleware.isAuthenticated, productController.all)
router.get('/products/new', sessionMiddleware.isAuthenticated, productController.new)
router.post('/products/new', sessionMiddleware.isAuthenticated, uploads.any(), productController.create)
router.get('/products/:id', sessionMiddleware.isAuthenticated, productController.view)
router.get('/products/:id/edit', sessionMiddleware.isAuthenticated, productController.viewEdit)
router.post('/products/:id/edit', sessionMiddleware.isAuthenticated, uploads.any(), productController.update)
router.post('/products/:id/delete', sessionMiddleware.isAuthenticated, productController.delete)

//CRUD chat
router.get('/junglesales/chats', sessionMiddleware.isAuthenticated, chatController.all)
router.post('/junglesales/chats/readed/recieved', sessionMiddleware.isAuthenticated, chatController.markRecievedReaded)
router.post('/junglesales/chats/readed/sent', sessionMiddleware.isAuthenticated, chatController.markSentReaded)
router.post('/junglesales/chats/new/:owner/:user/:product', sessionMiddleware.isAuthenticated, chatController.newChat)
router.get('/junglesales/chats/:id', sessionMiddleware.isAuthenticated, chatController.show)


// API ENDPOINTS
router.get('/api/storages', sessionMiddleware.isAuthenticated, storageController.apiGetStorages)
router.get('/api/storages/:id/boxes', sessionMiddleware.isAuthenticated, boxController.apiGetBoxesInStorage)
router.post('/api/boxes/new', sessionMiddleware.isAuthenticated, boxController.apiDoNewBox)
router.post('/api/addresses/new', sessionMiddleware.isAuthenticated, addressController.apiDoNewAddress)
router.get('/api/products/category', sessionMiddleware.isAuthenticated, productController.apiGetCountProductsGroupedCategoty)
router.post('/api/junglesales/chats/messages/new', sessionMiddleware.isAuthenticated, chatController.apiNewMessage)
router.get('/api/junglesales/chats/messages/get', sessionMiddleware.isAuthenticated, chatController.apiGetUnreadMessages)
router.post('/api/junglesales/chats/messages/readed', sessionMiddleware.isAuthenticated, chatController.apiMarkReadedMessage)

//JUNGLE SALES
router.get('/junglesales', junglesales.all)
router.get('/junglesales/:id/', sessionMiddleware.isAuthenticated, junglesales.jungleSpace)
router.get('/junglesales/:id/:productId', sessionMiddleware.isAuthenticated, junglesales.viewProduct)

/* 
TODO:
  router.get('/auth/slack', userController.doAuthSlack)
  router.get('/auth/google', userController.doAuthGoogle)
  router.get('/auth/facebook', userController.doAuthFacebook)
*/


module.exports = router;