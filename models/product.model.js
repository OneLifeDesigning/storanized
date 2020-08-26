const mongoose = require('mongoose');

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
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    trim: true
  }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;