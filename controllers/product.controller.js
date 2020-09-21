const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Attachment = require("../models/attachment.model");
const cloudinary = require('cloudinary').v2

const categories = ['Motorcycles','Motor and Accessories', 'Fashion and Accessories','TV, Audio and Photo','Mobile Phones and Telephony','Computers and Electronics', 'Sports and Leisure', 'Bicycles','Consoles and Videogames','Home and Garden','Household appliances', 'Cinema, Books and Music', 'Children and Babies','Collecting','Building materials', 'Industry and Agriculture', 'Others']

module.exports.all = (req, res, next) => {
  res.render("products/all", { 
    title: 'View all products',
    breadcrumbs: req.breadcrumbs,
    products:  req.currentUser.products
  });
};

module.exports.new = (req, res, next) => {
  res.render("products/new", {
    title: 'New product',
    breadcrumbs: req.breadcrumbs,
    categories,
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
                  res.render("products/new", { breadcrumbs: req.breadcrumbs, error: {message: 'There was a problem with saving product, please try again later'}, user: req.currentUser, product, categories });
                })
            })
            .catch(() => {
              res.render("products/new", { breadcrumbs: req.breadcrumbs, error: {message: 'There was a problem with uploading your image, please try again later'}, user: req.currentUser, product, categories });
            })
          
        } else {
          cloudinary.uploader.upload(req.body.imageCamera, {overwrite: true, invalidate: true, folder: 'storanized'})
          .then(image => {
            mainImage.url = image.url
            mainImage.save()
              .then(image => {
                product.image = image.id.toString()
                product.save()
                .then(() => {res.redirect(`/products/${product.id}`)})
                .catch(() => {
                  res.render("products/new", { breadcrumbs: req.breadcrumbs, error: {message: 'There was a problem with saving product, please try again later'}, user: req.currentUser, product, categories });
                })
              })
              .catch(() => {
                res.render("products/new", { breadcrumbs: req.breadcrumbs, error: {message: 'There was a problem with uploading your image, please try again later'}, user: req.currentUser, product, categories });
              })
            })
            .catch(() => {
                res.render("products/new", { breadcrumbs: req.breadcrumbs, error: {message: 'There was a problem with the uploading your image, please try again later'}, user: req.currentUser, product, categories });
            })
        }
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        error.errors.message = 'Please, check the data entered'
        res.render("products/new", { breadcrumbs: req.breadcrumbs, error: error.errors, product, user: req.currentUser, categories });
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
      req.breadcrumbs[req.breadcrumbs.length-1].name = product.name
      res.render("products/show", {
        title: 'Edit product',
        breadcrumbs: req.breadcrumbs,
        product,
        categories,
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
    req.breadcrumbs[req.breadcrumbs.length-1].name = product.name
    res.render("products/edit", {
      title: 'Edit product',
      breadcrumbs: req.breadcrumbs,
      product,
      categories,
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
    product.set(req.body)
    product.save()
      .then(product => {
        if(req.files.length !== 0 || req.body.imageCamera) {
          const mainImage = new Attachment({
            target: 'mainImage',
            product: product.id,
            user: req.currentUser.id
          })
                
          if(req.files.length !== 0) { 
            mainImage.url = req.files[0].path
            mainImage.save()
            .then(image => {
                product.image = image.id.toString()
                product.save()
                  .then(() => {res.redirect(`/products/${product.id}`)})
                  .catch(() => {
                    res.render("products/new", { error: {message: 'There was a problem with saving product, please try again later'}, user: req.currentUser, product, breadcrumbs: req.breadcrumbs, categories });
                  })
              })
              .catch(() => {
                res.render("products/new", { error: {message: 'There was a problem with uploading your image, please try again later'}, user: req.currentUser, product, breadcrumbs: req.breadcrumbs, categories });
              })
          } else if(req.body.imageCamera) {
            cloudinary.uploader.upload(req.body.imageCamera, {overwrite: true, invalidate: true, folder: 'storanized'})
            .then(image => {
              mainImage.url = image.url
              mainImage.save()
                .then(image => {
                  product.image = image.id.toString()
                  product.save()
                  .then(() => {res.redirect(`/products/${product.id}`)})
                  .catch(() => {
                    res.render("products/new", { error: {message: 'There was a problem with saving product, please try again later'}, user: req.currentUser, breadcrumbs: req.breadcrumbs, product, categories });
                  })
                })
                .catch(() => {
                  res.render("products/new", { error: {message: 'There was a problem with uploading your image, please try again later'}, user: req.currentUser, product, breadcrumbs: req.breadcrumbs, categories });
                })
              })
              .catch(() => {
                  res.render("products/new", { error: {message: 'There was a problem with the uploading your image, please try again later'}, user: req.currentUser, product, breadcrumbs: req.breadcrumbs, categories });
              })
          } 
        } else {
          res.redirect(`/products/${product.id}`)
        }
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          error.errors.message = 'Please, check the data entered'
          res.render("products/new", { error: error.errors, user: req.currentUser, product, breadcrumbs: req.breadcrumbs, categories });
        } else {
          next();
        }
      });
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        error.errors.message = 'Please, check the data entered'
        res.render("products/new", { error: error.errors, user: req.currentUser, product, breadcrumbs: req.breadcrumbs, categories });
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

module.exports.apiGetCountProductsGroupedCategoty = (req, res, next) => {
  Product.find({user: req.currentUser._id.toString()})
    .then(products => {
      const groupedCategories = []
      let maxValue = 0
      
      for (let index = 0; index < categories.length; index++) {
        let countProducts = products.filter(product => {
          return categories[index] === product.category[0]
        }).length
        maxValue = maxValue > countProducts ? maxValue : countProducts  
        groupedCategories.push(
          new Object({
            category: categories[index],
            count: countProducts
          })
        )
      }
      
      const filtered = groupedCategories.filter(el => {
        if (el.count > maxValue/1.5) {
          return  el
        }
      })

      res.json(filtered)
    })
    .catch(next);
};
