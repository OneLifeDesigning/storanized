const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')


router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  })
})
 
router.get('/login', userController.login)
router.post('/login', userController.doLogin)

router.get('/signup', userController.signup)
router.post('/signup', userController.doSignup)

router.get('/activate/:id/:token', userController.doValidateToken)

router.get('/profile', userController.viewProfile)
router.post('/profile', userController.doEditProfile)
router.get('/profile/password', userController.editPassword)
router.post('/profile/password', userController.doEditPassword)

router.post('/logout', userController.doLogout)


router.get('/activate/newtoken', userController.newToken)
router.post('/activate/newtoken', userController.doNewToken)

router.get('/password', userController.forgotPassword)
router.post('/password', userController.doForgotPassword)
router.get('/password/:id/:token', userController.recoveryPassword)

/* 
TODO:
  
  router.get('/auth/slack', userController.doAuthSlack)
  router.get('/auth/google', userController.doAuthGoogle)
  router.get('/auth/facebook', userController.doAuthFacebook)
  
 
*/


module.exports = router;