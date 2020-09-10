const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Attachment = require("../models/attachment.model");
const cloudinary = require('cloudinary').v2

const category = ['Motos', 'Motor y Accesorios', 'Moda y Accesorios', 'TV, Audio y Foto', 'Móviles y Telefonía', 'Informática y Electrónica', 'Deporte y Ocio', 'Bicicletas', 'Consolas y Videojuegos', 'Hogar y Jardín', 'Electrodomésticos', 'Cine, Libros y Música', 'Niños y Bebés', 'Coleccionismo', 'Materiales de construcción', 'Industria y Agricultura', 'Otros']

module.exports.all = (req, res, next) => {
  res.render("products/all", { 
    title: 'View all products',
    products:  req.currentUser.products
  });
};

module.exports.new = (req, res, next) => {
  res.render("products/new", {
    category: category,
    user: req.currentUser
  });
};

module.exports.create = (req, res, next) => {
  req.body.isSold = req.body.isSold ? true : false
  req.body.isPublic = req.body.isPublic ? true : false
  const product = new Product({
    ...req.body,
    user: req.currentUser._id.toString()
  });
  product.save()
    .then(product => {
      if(req.files || req.body.imageCamera) {
        const mainImage = new Attachment({
          target: 'mainImage',
          product: product.id,
          user: req.currentUser.id
        })
              
        if(req.files[0]) { 
          mainImage.url = req.files[0].path
          mainImage.save()
            .then(image => {
              product.image = image.id.toString()
              product.save()
                .then(() => {res.redirect(`/products/${product.id}`)})
                .catch(() => {
                  res.render("products/new", { error: {message: 'There was a problem with saving product, please try again later'}, user: req.currentUser, product, category: category });
                })
            })
            .catch(() => {
              res.render("products/new", { error: {message: 'There was a problem with uploading your image, please try again later'}, user: req.currentUser, product, category: category });
            })
          
        } else {
          cloudinary.uploader.upload(req.body.imageCamera, {overwrite: true, invalidate: true, folder: 'storanized'})
          .then(image => {
            mainImage.url = image.url
            mainImage.cloudinaryPublicId = image.public_id
            mainImage.save()
              .then(image => {
                product.image = image.id.toString()
                product.save()
                .then(() => {res.redirect(`/products/${product.id}`)})
                .catch(() => {
                  res.render("products/new", { error: {message: 'There was a problem with saving product, please try again later'}, user: req.currentUser, product, category: category });
                })
              })
              .catch(() => {
                res.render("products/new", { error: {message: 'There was a problem with uploading your image, please try again later'}, user: req.currentUser, product, category: category });
              })
            })
            .catch(() => {
                res.render("products/new", { error: {message: 'There was a problem with the uploading your image, please try again later'}, user: req.currentUser, product, category: category });
            })
        }
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("products/new", { error: error.errors, product, user: req.currentUser, category: category });
      } else {
        next();
      }
    });
};

module.exports.view = (req, res, next) => {
  Product.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
    .populate('attachments')
    .populate('box')
    .then(product => {
      res.render("products/show", {
        title: 'Edit product',
        product,
        category: category,
        user: req.currentUser
      })
    })
    .catch(next);
};

module.exports.viewEdit = (req, res, next) => {
  Product.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
  .populate('attachments')
  .populate('box')
  .then(product => {
    res.render("products/edit", {
      title: 'Edit product',
      product,
      category: category,
      user: req.currentUser
    })
  })
  .catch(next)
};

module.exports.update = (req, res, next) => {
  Product.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
  .then(product => {
    req.body.isSold = req.body.isSold ? true : false
    req.body.isPublic = req.body.isPublic ? true : false
    product.save()
      .then(product => {
        if(req.files || req.body.imageCamera) {
          const mainImage = new Attachment({
            target: 'mainImage',
            product: product.id,
            user: req.currentUser.id
          })
                
          if(req.files[0]) { 
            mainImage.url = req.files[0].path
            mainImage.cloudinaryPublicId =  req.files[0].public_id
            mainImage.save()
            .then(image => {
                product.image = image.id.toString()
                product.save()
                  .then(() => {res.redirect(`/products/${product.id}`)})
                  .catch(() => {
                    res.render("products/new", { error: {message: 'There was a problem with saving product, please try again later'}, user: req.currentUser, product, category: category });
                  })
              })
              .catch(() => {
                res.render("products/new", { error: {message: 'There was a problem with uploading your image, please try again later'}, user: req.currentUser, product, category: category });
              })
          } else {
            cloudinary.uploader.upload(req.body.imageCamera, {overwrite: true, invalidate: true, folder: 'storanized'})
            .then(image => {
              mainImage.url = image.url
              mainImage.cloudinaryPublicId = image.public_id
              mainImage.save()
                .then(image => {
                  product.image = image.id.toString()
                  product.save()
                  .then(() => {res.redirect(`/products/${product.id}`)})
                  .catch(() => {
                    res.render("products/new", { error: {message: 'There was a problem with saving product, please try again later'}, user: req.currentUser, product, category: category });
                  })
                })
                .catch(() => {
                  res.render("products/new", { error: {message: 'There was a problem with uploading your image, please try again later'}, user: req.currentUser, product, category: category });
                })
              })
              .catch(() => {
                  res.render("products/new", { error: {message: 'There was a problem with the uploading your image, please try again later'}, user: req.currentUser, product, category: category });
              })
          }
        }
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.render("products/new", { error: error.errors, user: req.currentUser, product, category: category });
        } else {
          next();
        }
      });
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("products/new", { error: error.errors, user: req.currentUser, product, category: category });
      } else {
        next();
      }
    });
};

module.exports.delete = (req, res, next) => {
  Product.findOne({user: req.currentUser._id.toString(), _id: req.params.id})
  .then(product => {
    product.remove()
      .then(() => {
        res.redirect("/products");
      })
      .catch(next);
    })
    .catch(next);
};
