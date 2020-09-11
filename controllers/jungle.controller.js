const mongoose = require("mongoose");
const Product = require("../models/product.model");
const User = require("../models/user.model");

module.exports.all = (req, res, next) => {
  Product.find({ isPublic: true })
    .populate("user")
    .then((products) => {
      res.render("jungle-sales/all", {
        products,
      });
    })
    .catch(next);
};

module.exports.jungleSpace = (req, res, next) => {
  User.findById(req.params.id)
    .populate({
      path: "products",
      populate: "user",
    })
    .then((user) => {
      res.render("jungle-sales/jungle-space", { user });
    })
    .catch(next);
};

module.exports.viewProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .populate("user")
    .then((product) => {
      res.render("jungle-sales/product", { product });
    })
    .catch(next);
};
