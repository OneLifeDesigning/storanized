const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
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

router.get('/activate/:id/:token', sessionMiddleware.isNotAuthenticated, userController.doValidateToken)

router.get('/profile', sessionMiddleware.isAuthenticated, userController.viewProfile)
router.post('/profile', sessionMiddleware.isAuthenticated, userController.doEditProfile)
router.get('/profile/password', sessionMiddleware.isAuthenticated, userController.editPassword)
router.post('/profile/password', sessionMiddleware.isAuthenticated, userController.doEditPassword)

router.post('/logout', sessionMiddleware.isAuthenticated, userController.doLogout)

router.get('/token', sessionMiddleware.isNotAuthenticated, userController.newToken)
router.post('/token', sessionMiddleware.isNotAuthenticated, userController.doNewToken)

router.get('/password', sessionMiddleware.isNotAuthenticated, userController.forgotPassword)
router.post('/password', sessionMiddleware.isNotAuthenticated, userController.doForgotPassword)
router.get('/password/:id/:token', sessionMiddleware.isNotAuthenticated, userController.recoveryPassword)

/* 
TODO:
  
  router.get('/auth/slack', userController.doAuthSlack)
  router.get('/auth/google', userController.doAuthGoogle)
  router.get('/auth/facebook', userController.doAuthFacebook)
  
 
*/


module.exports = router;