const mongoose = require("mongoose")
const Address = require("../models/address.model")
const Box = require("../models/box.model")

module.exports.doNewAddress = (req, res, next) => {
  const address = new Address({
    ...req.body,
    user: req.currentUser._id.toString()
  })
  address.defaultAddress = false
  address.save()
    .then(address => {
      res.status(200).json(address)
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(201).json(error.errors)
      } else {
        res.status(201).json(error);
      }
    })
};

module.exports.getBoxesInStorage = (req, res, next) => {
  Box.find({user: req.currentUser._id, storage: req.body.storage}, {name: 1})
  .then(boxes => {
    res.status(200).json(boxes)
  })
};