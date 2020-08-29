const mongoose = require('mongoose');
const Address = require('../models/address.model');

const storageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 3 chars'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  }
});

storageSchema.virtual("user", {
  ref: "User",
  localField: "_id",
  foreignField: "storage",
});

storageSchema.virtual("address", {
  ref: "Address",
  localField: "_id",
  foreignField: "storage",
});

storageSchema.post('remove', function (next) {
  Promise.all([
    Address.deleteMany({ storage: this._id })
  ])
    .then(next)
})

const Storage = mongoose.model('Storage', storageSchema);

module.exports = Storage;