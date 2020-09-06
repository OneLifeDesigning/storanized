const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    type: {
      type: String
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

const Attachment = mongoose.model("Attachment", attachmentSchema);

module.exports = Attachment;
