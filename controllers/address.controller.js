const mongoose = require("mongoose")
const Address = require("../models/address.model")
const User = require("../models/user.model")

module.exports.all = (req, res, next) => {
  address.find({user: req.currentUser._id.toString() })
    .then(addresss => {
      res.render("addresss/all", { 
        title: 'View all addresss',
        addresss
      });
    })
    .catch(next)
};

module.exports.new = (req, res, next) => {
  res.render('addresss/new', { 
    title: 'Add new Address',
    user: req.currentUser
  })
};

module.exports.doNew = (req, res, next) => {
  const address = new Address({
    ...req.body,
    user: req.currentUser._id.toString(),
  })
  address.save()
    .then(address => {
      res.redirect(`/addresss/${address._id}/show`)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("addresss/new", { 
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
  address.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
  .populate("user")
  .populate("address")
  .then(address => {
      res.render("addresss/show", { 
        title: 'View of address',
        address, 
        user: req.currentUser
      });
    })
    .catch(next);
};

module.exports.edit = (req, res, next) => {
  address.findById(req.params.id)
  .populate('user')
  .populate('address')
  .then(address => {
    res.render("addresss/edit", {
      title: 'Edit new Address',
      address,
      user: req.currentUser
    })
  })
  .catch(next)
};

module.exports.doEdit = (req, res, next) => {
  const body = req.body;
  address.findById(req.params.id)
    .then(address => {
      if (address.user.toString() === req.currentUser._id.toString()) {
        address.set(body);
        address.save()
          .then(() => {
            res.redirect(`/addresss/${address._id}`);
          })
          .catch(next);
      } else {
        res.redirect(`/addresss/${req.params.id}/edit`)
      }
    })
    .catch(next)
}


// module.exports.delete = (req, res, next) => {
//   req.address
//     .remove()
//     .then(() => {
//       res.redirect("/addresss");
//     })
//     .catch(next);
// };
