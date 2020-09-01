/* TODO: Main image, attachments gallery */

const mongoose = require('mongoose');
const Box = require('../models/box.model')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name needs at last 3 chars'],
    trim: true
  },
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
    enum: ['Motos', 'Motor y Accesorios', 'Moda y Accesorios', 'TV, Audio y Foto', 'Móviles y Telefonía', 'Informática y Electrónica', 'Deporte y Ocio', 'Bicicletas', 'Consolas y Videojuegos', 'Hogar y Jardín', 'Electrodomésticos', 'Cine, Libros y Música', 'Niños y Bebés', 'Coleccionismo', 'Materiales de construcción', 'Industria y Agricultura', 'Otros']
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
		type: Boolean,
		default: false
  },
  isSold: {
		type: Boolean,
		default: false
  }
});

productSchema.post('remove', function (next) {
  Promise.all([
    Box.deleteMany({ product: this._id })
  ])
    .then(next)
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;