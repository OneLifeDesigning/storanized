const User = require('../models/user.model')

module.exports.getCurrentUser = (req, res, next) => {
  const ordering = { sort: { updatedAt: -1 } }
  User.findById(req.session.userId)
    .populate({
      path: 'addresses',
      options: ordering
    })
    .populate({
      path: 'storages',
      options: ordering
    })
    .populate({
      path: 'boxes',
      options: ordering
    })
    .populate({
      path: 'products',
      options: ordering
    })
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