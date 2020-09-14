require('dotenv').config()

const mongoose = require('mongoose');
const QRCode = require('qrcode');
const cloudinary = require('cloudinary').v2

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 3 chars'],
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

boxSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "box",
});

boxSchema.pre('save', function(next) {
  QRCode.toDataURL(process.env.HOST || 'http://localhost:3000/' + 'boxes/' + this._id.toString())
  .then(qrcode => {
    cloudinary.uploader.upload(qrcode, { 
      overwrite: true, invalidate: true, folder: 'storanized/qrCode', 
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    })
    .then(result => {
      this.qrCode = result.url
      next()
    })
    .catch(next)
  })
  .catch(next)
})

const Box = mongoose.model('Box', boxSchema);

module.exports = Box;