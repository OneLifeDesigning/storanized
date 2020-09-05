const mongoose = require('mongoose');
const Storage = require('../models/storage.model')
 
const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  qrCode: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  storage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Storage",
    required: true,
  }
},{ timestamps: true, toJSON: { virtuals: true } });

boxSchema.virtual("product", {
  ref: "Product",
  localField: "_id",
  foreignField: "box",
});

boxSchema.post('remove', function (next) {
  Promise.all([
    Storage.deleteMany({ box: this._id })
  ])
    .then(next)
})


const Box = mongoose.model('Box', boxSchema);

module.exports = Box;