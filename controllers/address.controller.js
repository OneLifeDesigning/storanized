const mongoose = require("mongoose")
const Address = require("../models/address.model")
const Storage = require("../models/storage.model")

module.exports.all = (req, res, next) => {
  Address.find({user: req.currentUser._id.toString() })
    .then(addresses => {
      res.render("addresses/all", { 
        title: 'View all addresses',
        addresses
      });
    })
    .catch(next)
};

module.exports.new = (req, res, next) => {
  res.render('addresses/new', { 
    title: 'Add new Address',
    user: req.currentUser,
    address: {
      name: 'Gerald Ford',
      address: 'Justo esta',
      city: "asddsa",
      state: "sad",
      country: "saddsa",
      postalCode: "dsa",
      longitude: -3.690572,
      latitude: 40.459452,
    }
  })
};

module.exports.doNew = (req, res, next) => {
  req.body.defaultAddress = req.body.defaultAddress ? true : false
  const address = new Address({
    ...req.body,
    user: req.currentUser._id.toString(),
  })
  address.save()
  .then(address => {
    if (address.defaultAddress) {
      Address.findOne({user: req.currentUser._id.toString(), defaultAddress: true})
      .then(oldAddress => {
        oldAddress.defaultAddress = false
        oldAddress.save()
          .then(() => {
            res.redirect(`/addresses/${address._id}`)
          })
          .catch(next)
        })
      .catch(next)
    } else {
      res.redirect(`/addresses/${address._id}`)
    }
  })
  .catch(error => {
    if (error instanceof mongoose.Error.ValidationError) {
      res.render("addresses/new", { 
        title: 'Add new Address',
        error: error.errors, 
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
        user: req.currentUser
      });
    })
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  Address.findById(req.params.id)
  .then(address => {
    res.render("addresses/edit", {
      title: 'Edit new Address',
      address,
      user: req.currentUser
    })
  })
  .catch(next)
};

module.exports.doEdit = (req, res, next) => {
  const body = req.body;
  body.defaultAddress = body.defaultAddress ? true : false
  
  Address.findById(req.params.id)
    .then(address => {
      if (address.user.toString() === req.currentUser._id.toString()) {
        address.set(body);
        address.save()
          .then(() => {
            res.redirect(`/addresses/${address._id}`);
          })
          .catch(next);
      } else {
        res.redirect(`/addresses/${req.params.id}/edit`)
      }
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  Address.findById(req.params.id)
  .then(address => {
    if (address.defaultAddress) {
      res.render("addresses/show", { 
        title: 'View of address',
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