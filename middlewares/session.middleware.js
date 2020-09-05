const User = require('../models/user.model')

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.session.userId)
    .populate('addresses')
    .populate('storages')
    .populate('boxes')
    .populate('products')
    .then(user => {
      if (!user) {
        res.locals.currentUser = false
        req.currentUser = false
      } else {
        res.locals.currentUser = user
        req.currentUser = user
      }
      next()
    })
    .catch(() => {
      res.redirect('/login')
    });
  }
  
  module.exports.isAuthenticated = (req, res, next) => {
    User.findById(req.session.userId)
    .then(user => {
      if (user) {
        next()
      } else {
        res.redirect('/login')
      }
    })
    .catch(next);
}

module.exports.isNotAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        res.redirect("/dashboard");
      } else {
        next();
      }
    })
    .catch(next);
};