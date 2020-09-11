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

addressSchema.pre('save', function(next) {
  if (this.defaultAddress === true) {
    Address.findOneAndUpdate({user: this.user, defaultAddress: true, _id: { $ne:  this._id }}, {defaultAddress: false})
    .then(next)
    .catch(next)
  } else {
    Address.findById( this._id )
      .then(address => {
        if (address && address.defaultAddress === true) {
          this.defaultAddress = true
          const error = {defaultAddress: {
            message: 'The changes have been saved correctly, except the default address change, you must at least have an assigned, edit another in its place'
          }}
          next(error)
        } else {
          next()
        }
      })
      .catch(next)
    }  
})

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;