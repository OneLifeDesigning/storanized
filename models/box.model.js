const mongoose = require('mongoose');
const QRCode = require('qrcode')
 
const boxSchema = new mongoose.Schema({
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
})

//TODO: Pending iterarion when seeds use save
// boxSchema.post('save', function (next) {
  // QRCode.toDataURL(this._id,toString, function (err, url) {
  //   console.log(url)
  // })
  // Promise.all([
  //   Like.deleteMany({ project: this._id }),
  //   Comment.deleteMany({ project: this._id })
  // ])
  //   .then(next)
//   next()
// })

const Box = mongoose.model('Box', boxSchema);

module.exports = Box;