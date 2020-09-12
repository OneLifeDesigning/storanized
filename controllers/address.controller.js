const mongoose = require("mongoose")
const Address = require("../models/address.model")
const Storage = require("../models/storage.model")

module.exports.all = (req, res, next) => {
    res.render("addresses/all", { 
      title: 'View all addresses',
      breadcrumbs: req.breadcrumbs,
      addresses: req.currentUser.addresses
    });
};

module.exports.new = (req, res, next) => {
  res.render('addresses/new', { 
    title: 'Add new Address',
    breadcrumbs: req.breadcrumbs,
    user: req.currentUser,
  })
};

module.exports.doNew = (req, res, next) => {
  req.body.defaultAddress = req.body.defaultAddress ? true : false
  const address = new Address({
    ...req.body,
    user: req.currentUser._id.toString()
  })
  if (address.defaultAddress) {
    Address.findOne({user: req.currentUser._id.toString(), defaultAddress: true})
      .then(oldAddress => {
        oldAddress.defaultAddress = false
        oldAddress.save()
          .then()
          .catch(next)
      })
      .catch(next)
  }
  address.save()
    .then(address => {
      res.redirect(`/addresses/${address._id}`)
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("addresses/new", { 
          title: 'Add new Address',
          error: error.errors, 
          breadcrumbs: req.breadcrumbs,
          address,
          user: req.currentUser
        })
      } else {
        next(error)
      }
    })
};


module.exports.show = (req, res, next) => {
  Address.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
  .then(address => {
      res.render("addresses/show", { 
        title: 'View of address',
        address, 
        user: req.currentUser,
        breadcrumbs: req.breadcrumbs
      });
    })
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  Address.findOne({_id: req.params.id, user: req.currentUser._id.toString()})
  .then(address => {
    res.render("addresses/edit", {
      title: 'Edit new Address',
      breadcrumbs: req.breadcrumbs,
      address,
      user: req.currentUser
    })
  })
  .catch(next)
};

module.exports.doEdit = (req, res, next) => {
  const body = req.body;
  body.defaultAddress = body.defaultAddress ? true : false
  Address.findOneAndUpdate({_id: req.params.id, user: req.currentUser._id.toString()}, body, { runValidators: true, new: true })
    .then(address => {
      if (address.defaultAddress) {
        Address.findOne({user: req.currentUser._id.toString(), defaultAddress: true, _id: { $ne: address._id}})
          .then(oldAddress => {
            oldAddress.defaultAddress = false
            oldAddress.save()
              .then()
              .catch(next)
          })
          .catch(next)
      }
      res.redirect(`/addresses/${address._id}`)
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("addresses/edit", { 
          title: 'Add new Address',
          error: error.errors,
          breadcrumbs: req.breadcrumbs, 
          address,
          user: req.currentUser
        })
      } else {
        next(error)
      }
    })
}

module.exports.delete = (req, res, next) => {
  Address.findById(req.params.id)
  .then(address => {
    if (address.defaultAddress) {
      res.render("addresses/show", { 
        title: 'View of address',
        breadcrumbs: req.breadcrumbs,
        address, 
        user: req.currentUser,
        error: {
          message: 'This address mark as default address, is not posible deleted'
        }
      });
    } else {
      Address.findOne({user: req.currentUser._id.toString(), defaultAddress: true})
      .then(newAddress => {
        Storage.updateMany({address: address.id}, {address: newAddress.id})
        .then(() => {
          address.remove()
            .then(() => {
              res.redirect("/addresses");
            })
            .catch(next)
        })
      })
      .catch(next)
    }
  })
  .catch(next)
}