/* TODO: Main image, attachments gallery */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  tags: {
    type: Array,
    trim: true
  },
  category: {
    type: Array,
    trim: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attachment",
  },
  user: {
    required: [true, 'User is required'],
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  box: {
    required: [true, 'Box is required'],
    type: mongoose.Schema.Types.ObjectId,
    ref: "Box"
  },
  price: {
    type: Number,
    trim: true
  },
	isPublic: {
		type: Boolean,
		default: false
  },
  isSold: {
		type: Boolean,
		default: false
  }
},{ timestamps: true, toJSON: { virtuals: true } });

productSchema.virtual("attachments", {
  ref: "Attachment",
  localField: "_id",
  foreignField: "product",
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;