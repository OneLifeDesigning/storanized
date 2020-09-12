const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2


const attachmentSchema = new mongoose.Schema(
  {
    target: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);


attachmentSchema.post('save', function (next) {
  Attachment.deleteMany({ product: this.product, _id: { $ne:  this._id }})
    .then(next)
    .catch(next)
  })
  

const Attachment = mongoose.model("Attachment", attachmentSchema);

module.exports = Attachment;
