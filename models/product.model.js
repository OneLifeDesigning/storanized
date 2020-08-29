/* TODO: Main image, attachments gallery */

const mongoose = require('mongoose');
const Box = require('../models/box.model')

const productSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [3, 'Description needs at last 3 chars'],
    trim: true
  },
  tags: {
    type: Array
  },
  category: {
    enum: ['Motos', 'Motor y Accesorios', 'Moda y Accesorios', 'TV, Audio y Foto', 'Móviles y Telefonía', 'Informática y Electrónica', 'Deporte y Ocio', 'Bicicletas', 'Consolas y Videojuegos', 'Hogar y Jardín', 'Electrodomésticos', 'Cine, Libros y Música', 'Niños y Bebés', 'Coleccionismo', 'Materiales de construcción', 'Industria y Agricultura', 'Otros'],
    default: 'Otros'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Box"
  },
  price: {
    type: Number,
    trim: true
  },
	isPublic: {
		type: boolean,
		default: false
  },
  isSold: {
		type: boolean,
		default: false
  }
});

productSchema.virtual("user", {
  ref: "User",
  localField: "_id",
  foreignField: "product",
});

productSchema.virtual("box", {
  ref: "Box",
  localField: "_id",
  foreignField: "product",
});

productSchema.post('remove', function (next) {
  Promise.all([
    Box.deleteMany({ product: this._id })
  ])
    .then(next)
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;