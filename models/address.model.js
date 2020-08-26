const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 3 chars'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    minlength: [6, 'Address needs at last 6 chars'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Postal Code is required'],
    minlength: [3, 'Postal Code needs at last 3 chars'],
    trim: true
  },
  phone: {
    type: Number,
    trim: true
  },
  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  },
  defaultAdrress: {
    type: String,
    enum: ['on'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
})

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;