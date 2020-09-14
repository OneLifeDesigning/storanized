const mongoose = require("mongoose")
const Storage = require("../models/storage.model")

module.exports.all = (req, res, next) => {
    res.render("storages/all", { 
      title: 'View all storages',
      storages:  req.currentUser.storages,
      breadcrumbs: req.breadcrumbs
    });
};

module.exports.new = (req, res, next) => {
  res.render('storages/new', { 
    title: 'Add new storage',
    breadcrumbs: req.breadcrumbs,
    user: req.currentUser
  })
};

module.exports.doNew = (req, res, next) => {
  const storage = new Storage({
    ...req.body,
    user: req.currentUser._id.toString(),
  })
  storage.save()
    .then(storage => {
      res.redirect(`/storages/${storage._id}`)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        error.errors.message = 'Please, check the data entered'
        res.render("storages/new", { 
          title: 'Add new storage',
          breadcrumbs: req.breadcrumbs,
          error: error.errors, 
          storage,
          user: req.currentUser
        })
      } else {
        next(error)
      }
    })
};

module.exports.show = (req, res, next) => {
  Storage.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
  .populate("user")
  .populate("address")
  .then(storage => {
      res.render("storages/show", { 
        breadcrumbs: req.breadcrumbs,
        title: 'View of storage',
        storage, 
        user: req.currentUser
      });
    })
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  Storage.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
  .populate("address")
  .then(storage => {
    res.render("storages/edit", {
      breadcrumbs: req.breadcrumbs,
      title: 'Edit new storage',
      storage,
      user: req.currentUser
    })
  })
  .catch(next)
};

module.exports.doEdit = (req, res, next) => {
  const body = req.body;
  Storage.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
    .then(storage => {
      if (storage.user.toString() === req.currentUser._id.toString()) {
        storage.set(body);
        storage.save()
          .then(() => {
            res.redirect(`/storages/${storage._id}`);
          })
          .catch(next);
      } else {
        res.redirect(`/storages/${req.params.id}/edit`)
      }
    })
    .catch(next)
}

module.exports.apiGetStorages = (req, res, next) => {
  Storage.find({user: req.currentUser._id}, {name: 1})
  .then(storages => {
    res.status(200).json(storages)
  })
};