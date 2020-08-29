const mongoose = require("mongoose");
const Product = require("../models/product.model");
const User = require("../models/user.model");

module.exports.all = (req, res, next) => {
  Product.find()
    .populate("user")
    .populate("box")
    .then((product) => {
      res.render("products/all", { product });
    })
    .catch(next);
};

module.exports.new = (req, res, next) => {
  res.render("products/new");
};

module.exports.create = (req, res, next) => {
  const product = new Product({
    ...req.body,
  });

  product
    .save()
    .then((product) => {
      res.redirect(`/products/${product._id}`);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("products/new", { error: error.errors, product });
      } else {
        next(error);
      }
    });
};

module.exports.view = (req, res, next) => {
  Product.findById(req.params.id)
    .populate("user")
    .populate("box")
    .then((product) => {
      res.render("products/view", { product });
    })
    .catch(next);
};

module.exports.viewEdit = (req, res, next) => {
    res.render("products/edit");
};

module.exports.update = (req, res, next) => {
  const body = req.body;
  const product = req.product;

  product.set(body);
  product
    .save()
    .then(() => {
      res.redirect(`/products/${product._id}`);
    })
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  req.product
    .remove()
    .then(() => {
      res.redirect("/products");
    })
    .catch(next);
};
