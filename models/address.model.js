const mongoose = require('mongoose');
const { address } = require('faker');

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
    required: [true, 'State is required'],
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
  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  },
  defaultAddress: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
},{ timestamps: true, toJSON: { virtuals: true } });

addressSchema.virtual("storage", {
  ref: "Storage",
  localField: "_id",
  foreignField: "address",
});


const Address = mongoose.model('Address', addressSchema);

module.exports = Address;