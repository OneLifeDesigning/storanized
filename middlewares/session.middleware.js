const User = require('../models/user.model')

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.session.userId)
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
    .catch(next);
}

module.exports.isAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        req.currentUser = user
        res.locals.currentUser = user

        next()
      } else {
        res.redirect('/profile')
      }
    })
    .catch(next);
}

module.exports.isNotAuthenticated = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (user) {
        res.redirect("/profile");
      } else {
        next();
      }
    })
    .catch(next);
};
