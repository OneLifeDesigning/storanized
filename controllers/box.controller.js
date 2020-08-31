const mongoose = require("mongoose");
const Box = require("../models/box.model");
const User = require("../models/user.model");

module.exports.all = (req, res, next) => {
  Box.find()
    .populate("user")
    .populate("storage")
    .then((box) => {
      res.render("boxs/all", { box });
    })
    .catch(next);
};

module.exports.newBox = (req, res, next) => {
  res.render("boxs/new");
};

module.exports.create = (req, res, next) => {
  const box = new Box({
    ...req.body,
  });

  box
    .save()
    .then((box) => {
      res.redirect(`/boxs/${box._id}`);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("boxs/new", { error: error.errors, box });
      } else {
        next(error);
      }
    });
};

module.exports.view = (req, res, next) => {
  Box.findById(req.params.id)
    .populate("user")
    .populate("storage")
    .then((box) => {
      res.render("boxs/view", { box });
    })
    .catch(next);
};

module.exports.viewEdit = (req, res, next) => {
    res.render("boxs/edit");
};

module.exports.update = (req, res, next) => {
  const body = req.body;
  const box = req.box;

  box.set(body);
  box
    .save()
    .then(() => {
      res.redirect(`/boxs/${box._id}`);
    })
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  req.box
    .remove()
    .then(() => {
      res.redirect("/boxs");
    })
    .catch(next);
};
