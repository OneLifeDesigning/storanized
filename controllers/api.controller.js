const mongoose = require("mongoose")
const Address = require("../models/address.model")
const Storage = require("../models/storage.model")
const Box = require("../models/box.model")

module.exports.doNewAddress = (req, res, next) => {
  req.body.defaultAddress = req.body.defaultAddress ? true : false 
  const address = new Address({
    ...req.body,
    user: req.currentUser._id.toString()
  })
  address.save()
    .then(address => {
      res.status(200).json(address)
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        error.errors.message = 'Please, check the data entered'
        res.status(201).json(error.errors)
      } else {
        res.status(201).json(error);
      }
    })
}

module.exports.doNewBox = (req, res, next) => {
  const box = new Box({
    ...req.body,
    user: req.currentUser._id.toString()
  })
  box.save()
    .then(box => {
      res.status(200).json(box)
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        error.errors.message = 'Please, check the data entered'
        res.status(201).json(error.errors)
      } else {
        res.status(201).json(error);
      }
    })
}

module.exports.getStorages = (req, res, next) => {
  Storage.find({user: req.currentUser._id}, {name: 1})
  .then(storages => {
    res.status(200).json(storages)
  })
};

module.exports.getBoxesInStorage = (req, res, next) => {
  Box.find({user: req.currentUser._id, storage: req.params.id}, {name: 1})
  .then(boxes => {
    res.status(200).json(boxes)
  })
};