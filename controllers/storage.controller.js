const mongoose = require("mongoose");
const Storage = require("../models/storage.model");
const User = require("../models/user.model");

module.exports.list = (req, res, next) => {
  Storage.find()
    .populate("user")
    .populate("address")
    .then((storage) => {
      res.render("storages/list", {
        storage,
        user: req.currentUser
      });
    })
    .catch(next);
}

module.exports.newStorage = (req, res, next) => {
  User.find({ user: true })
    .then(storageUsers => {
      res.render('storages/new', { storageUsers })
    })
    .catch(next)  
}

module.exports.create = (req, res, next) => {
  const storage = new Storage({
    ...req.body,
    user: req.currentUser._id,
  });

  storage
    .save()
    .then((storage) => {
      res.redirect(`/storages/${storage._id}`);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("storages/new", { error: error.errors, storage });
      } else {
        next(error);
      }
    });
};

module.exports.view = (req, res, next) => {
  Storage.findById(req.params.id)
    .populate('user')
    .populate('address')
    .then(storage => {
      res.render('storages/view', { storage })
    })
    .catch(next)
}

module.exports.viewEdit = (req, res, next) => {
  User.find({ storage: true })
    .then((storageUsers) => {
      res.render('storages/edit', { storageUsers, storage: req.storage })
    })
    .catch(next)
}

module.exports.update = (req, res, next) => {
  const body = req.body;
  const storage = req.storage;

  storage.set(body);
  storage.save()
    .then(() => {
      res.redirect(`/storages/${storage._id}`)
  })
  .catch((next))
};

module.exports.delete = (req, res, next) => {
    req.storage.remove()
      .then(() => {
        res.redirect('/storages')
      })
      .catch(next)
}


