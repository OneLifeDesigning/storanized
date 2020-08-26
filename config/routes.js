const express = require('express')
const router = express.Router()
const userController = require('./controller/user.controller')


router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home'
  })
})
 
router.get('/login', userController.login)
router.post('/login', userController.doLogin)

router.get('/signup', userController.signup)
router.post('/signup', userController.doSignup)

router.post('/logout', userController.doLogout)

/* 
TODO:

  router.get('/activate/:token', userController.doValidateToken)
  router.get('/activate/token', userController.getNewToken)
  router.post('/activate/token', userController.sendwNewToken)
  
  router.get('/auth/slack', userController.doAuthSlack)
  router.get('/auth/google', userController.doAuthGoogle)
  router.get('/auth/facebook', userController.doAuthFacebook)
  
  router.post('/password', userController.recoveryPassword)
  router.post('/password', userController.doRecoveryPassword)

  router.get('/profile/:id', userController.viewProfile)
  router.post('/profile/:id/edit', userController.doEditProfile)
  
*/


module.exports = router;