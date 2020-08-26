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

router.get('/profile', userController.viewProfile)
router.post('/profile/:id/edit', userController.doEditProfile)

router.post('/logout', userController.doLogout)

router.get('/activate/:id/:token', userController.doValidateToken)

router.get('/activate/newtoken', userController.newToken)
router.post('/activate/newtoken', userController.doNewToken)

/* 
TODO:

  
  router.get('/auth/slack', userController.doAuthSlack)
  router.get('/auth/google', userController.doAuthGoogle)
  router.get('/auth/facebook', userController.doAuthFacebook)
  
  router.post('/password/:id/:token', userController.recoveryPassword)
  router.post('/password', userController.modifyPassword)
  router.post('/password', userController.doModifyPassword)
 
*/


module.exports = router;