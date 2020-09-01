const mongoose = require("mongoose")
const Storage = require("../models/storage.model")
const User = require("../models/user.model")

module.exports.all = (req, res, next) => {
  Storage.find({user: req.currentUser._id })
    .then(storages => {
      res.render("storages/all", { 
        title: 'View all storages',
        storages
      });
    })
    .catch(next)
};

module.exports.new = (req, res, next) => {
  User.findById(req.currentUser._id)
  .populate('addresses')
  .then(user => {
    res.render('storages/new', { 
      title: 'Add new storage',
      user
    })
  })
  .catch(next)
};

module.exports.doNew = (req, res, next) => {
  const storage = new Storage({
    ...req.body,
    user: req.currentUser._id,
  })
  storage.save()
    .then(storage => {
      res.redirect(`/storages/show/${storage._id}`)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("storages/new", { 
          title: 'Add new storage',
          error: error.errors, 
          storage 
        })
      } else {
        next(error)
      }
    })
};

module.exports.show = (req, res, next) => {
  Storage.findOne({user: req.currentUser._id, _id: req.params.id})
  .populate("user")
  .populate("address")
  .then(storage => {
      res.render("storages/show", { 
        title: 'View of storage',
        storage
      });
    })
    .catch(next);
};

module.exports.viewEdit = (req, res, next) => {
  Storage.findById(req.params.id)
  .populate('user')
  .populate('address')
  .then(storage => {
    res.render("storages/edit", {
      title: 'Edit new storage',
      storage
    })
  })
  .catch(next)
};

module.exports.update = (req, res, next) => {
  const body = req.body;
  const storage = req.storage;

  storage.set(body);
  storage
    .save()
    .then(() => {
      res.redirect(`/storages/${storage._id}`);
    })
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  req.storage
    .remove()
    .then(() => {
      res.redirect("/storages");
    })
    .catch(next);
};
